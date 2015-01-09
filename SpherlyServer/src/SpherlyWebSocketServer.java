import java.awt.Color;
import java.io.PrintWriter;
import java.io.StringWriter;
import java.net.InetSocketAddress;
import java.net.UnknownHostException;
import java.util.Iterator;
import java.util.Vector;

import javax.bluetooth.RemoteDevice;

import org.java_websocket.WebSocket;
import org.java_websocket.handshake.ClientHandshake;
import org.java_websocket.server.WebSocketServer;
import org.json.simple.JSONArray;
import org.json.simple.JSONObject;
import org.json.simple.parser.JSONParser;
import org.json.simple.parser.ParseException;

public class SpherlyWebSocketServer extends WebSocketServer{
	private Sphero sp;
	private Vector<RemoteDevice> sp_devices;
	private Object lock;
	private Main commandPrompt;
	
	public SpherlyWebSocketServer(Main commandPrompt) throws UnknownHostException {
		super(new InetSocketAddress(8080));
		this.commandPrompt = commandPrompt;
		displayMessage("Server is up!");
		
		lock = new Object();
		sp = new Sphero(this);
		sp_devices = null;
	}

	@Override
	public void onOpen(WebSocket conn, ClientHandshake handshake) {
		displayMessage("Connected to webclient!");
		sp = new Sphero(this);
	}

	@Override
	public void onClose(WebSocket conn, int code, String reason, boolean remote) {
		displayMessage("Disconnected from webclient");
		sp.Disconnect();
		sp = null;
	}

	@Override
	public void onMessage(WebSocket conn, String message) {
		JSONObject data;
		try {
			data = (JSONObject)new JSONParser().parse(message);
		} catch (ParseException e) {
			StringWriter sw = new StringWriter();
			PrintWriter pw = new PrintWriter(sw);
			e.printStackTrace(pw);
			displayError(sw.toString());
			return;
		}
		
		//Respond to the command
		String command = (String)data.get("command");
		//System.out.println("Command: " + command);
		if (command.equals("listDevices")){
			JSONArray response = ListDevices(data);
			conn.send(response.toJSONString());
		}
		else if (command.equals("connectToDevice")){
			JSONObject response = ConnectToDevice(data);
			conn.send(response.toJSONString());
			
			final WebSocket connection = conn;
			Sphero.SpheroHandler onPowerNotification = new Sphero.SpheroHandler() {
				public void handle(byte data) {
					JSONObject response = new JSONObject();
					response.put("power", true);
					response.put("data", data);
					if (data == 1){
						displayMessage("battery charging");
					}else if (data == 3){
						displayMessage("battery low");
					}else if (data == 4){
						displayMessage("battery critical!");
					}

					connection.send(response.toJSONString());
				}
				public void handle() {}
			};
			sp.SetPowerNotificationHandler(onPowerNotification);
			sp.EnablePowerNotification(true);
		}
		else if (command.equals("disconnect")){
			try{
				sp.Disconnect();
			}catch (Exception e){
				StringWriter sw = new StringWriter();
				PrintWriter pw = new PrintWriter(sw);
				e.printStackTrace(pw);
				displayError(sw.toString());
			}
		}
		else if (command.equals("setRGB")){
			displayMessage("Set RGB, R: "+data.get("red")+
					", G: "+data.get("green")+
					", B:"+data.get("blue"));
			int red = ((Long)data.get("red")).intValue();
			int green = ((Long)data.get("green")).intValue();
			int blue = ((Long)data.get("blue")).intValue();
			sp.SetRGB(red, green, blue);
		}
		else if (command.equals("roll")){
			int speed = ((Long)data.get("speed")).intValue();
			int heading = ((Long)data.get("heading")).intValue();
			if (speed < 0) speed = 0;
			if (speed > 255) speed = 255;
			displayMessage("Roll: heading="+heading+", speed="+speed);
			sp.Roll(heading, speed);
		}
		else if (command.equals("rollForward")){
			int speed = ((Long)data.get("speed")).intValue();
			if (speed < 0) speed = 0;
			if (speed > 255) speed = 255;
			displayMessage("Roll Forward: speed="+speed);
			sp.RollForward(speed);
		}
		else if (command.equals("turn")){
			int direction = ((Long)data.get("direction")).intValue();
			displayMessage("Turn: direction="+direction);
			sp.Turn(direction);
		}
		else if (command.equals("setStabilization")){
			boolean flag = (boolean)data.get("flag");
			displayMessage("Set Stabilization: " + flag);
			sp.SetStabilization(flag);
		}
		else if (command.equals("setRotationRate")){
			int rate = ((Long)data.get("rate")).intValue();
			displayMessage("Set Rotation Rate: " + rate);
			sp.SetRotationRate(rate);
		}
		else if (command.equals("stop")){
			displayMessage("Stop Rolling");
			sp.Stop();
		}
		else if (command.equals("sleep")){
			displayMessage("goodnight");
			sp.Sleep();
		}
		else if (command.equals("setBackLED")){
			int value = ((Long)data.get("value")).intValue();
			displayMessage("Set Back LED: value="+value);
			sp.SetBackLED(value);
		}
		else if (command.equals("setCollisionDetection")){
			boolean value = (boolean)data.get("value");
			displayMessage("Enable Collision Detection: " + value);
			sp.EnableCollisionDetection(value);
			
			if (value){
				final WebSocket connection = conn;
				
				Sphero.SpheroHandler onCollide = new Sphero.SpheroHandler(){
					public void handle() {
						JSONObject response = new JSONObject();
						response.put("collision", true);
						connection.send(response.toJSONString());
					}
					public void handle(byte data){}
				};
				sp.SetCollisionHandler(onCollide);
			}else{
				sp.SetCollisionHandler(null);
			}
		}
		else if (command.equals("clear")){
			//System.out.println("clear");
			sp.ClearPacketNum();
			//TODO:: how to clear the screen? how will this app run?
		}
		else{
			displayMessage("TODO: " + command);
		}
	}
	
	public void displayMessage(String message){
		commandPrompt.printToCommandPrompt(message, Color.BLACK);
	}
	
	public void displayError(String error){
		commandPrompt.printToCommandPrompt(error, Color.RED);
	}

	@Override
	public void onError(WebSocket conn, Exception ex) {
		displayError(ex.getStackTrace().toString());
		ex.printStackTrace();
	}
	
	//Seperate functions to deal with larger responses to certain messages
	public JSONArray ListDevices(JSONObject data){
		displayMessage("searching for spheros...");
		try{
			sp_devices = sp.FindSpheros(true);
	
			JSONArray jsonDevices = new JSONArray();
			if (sp_devices.size() == 0){
				displayMessage("no spheros found."); 
				displayMessage("Have you paired one to your computer through the Bluetooth Manager?");
			}
			else displayMessage("found spheros:");
			for (Iterator i = sp_devices.iterator(); i.hasNext(); ){
				RemoteDevice d = (RemoteDevice)i.next();
				JSONObject jsonDevice = new JSONObject();
				String name = d.getFriendlyName(false);
				String address = d.getBluetoothAddress();
				jsonDevice.put("name", name);
				jsonDevice.put("address", FormatAddress(address));
				displayMessage("name: " + name + ", address: " + address);
				jsonDevices.add(jsonDevice);
			}
			
			return jsonDevices;
		}catch(Exception e){
			StringWriter sw = new StringWriter();
			PrintWriter pw = new PrintWriter(sw);
			e.printStackTrace(pw);
			displayError(sw.toString());
			return null;
		}
	}
	
	public JSONObject ConnectToDevice(JSONObject data){
		String name = (String)data.get("name");
		String address = (String)data.get("address");
		address = UnformatBluetoothAddress(address);
		
		JSONObject json = new JSONObject();
		if (sp.Connect(address)){
			json.put("connected", true);
			displayMessage("Connection successful");
		}else{
			json.put("connected", false);
			displayMessage("Connection NOT successful");
		}
		return json;
	}
	
	public String FormatAddress(String ba){
		String address = "";
		for (int i = 0; i < ba.length(); i+=2){
			if (i != 0)
				address += ":";
			address += ba.substring(i, i+2);
		}
		return address;
	}
	
	public String UnformatBluetoothAddress(String address){
		String ba = "";
		for (int i = 0; i < address.length(); i++){
			if (address.charAt(i) != ':')
				ba += address.charAt(i);
		}
		return ba;
	}
}
