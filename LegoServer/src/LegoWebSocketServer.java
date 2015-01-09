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

public class LegoWebSocketServer extends WebSocketServer{
	private LegoBrick brick;
	private Vector<RemoteDevice> brick_devices;
	private Object lock;
	
	public LegoWebSocketServer() throws UnknownHostException {
		super(new InetSocketAddress(8080));
		System.out.println("Server is up!");
		
		lock = new Object();
		brick = new LegoBrick(this);
		brick_devices = null;
	}

	@Override
	public void onOpen(WebSocket conn, ClientHandshake handshake) {
		System.out.println("Connected to webclient!");
		brick = new LegoBrick(this);
	}

	@Override
	public void onClose(WebSocket conn, int code, String reason, boolean remote) {
		System.out.println("Disconnected from webclient");
		brick.Disconnect();
		brick = null;
	}

	@Override
	public void onMessage(WebSocket conn, String message) {
		JSONObject data;
		try {
			data = (JSONObject)new JSONParser().parse(message);
		} catch (ParseException e) {
			e.printStackTrace();
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
			/*Sphero.SpheroHandler onPowerNotification = new Sphero.SpheroHandler() {
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
			sp.EnablePowerNotification(true);*/
		}
		else if (command.equals("disconnect")){
			try{
				brick.Disconnect();
			}catch (Exception e){
			}
		}
		else if (command.equals("clear")){
			//System.out.println("clear");
			brick.ClearPacketNum();
			//TODO:: how to clear the screen? how will this app run?
		}
		else{
			displayMessage("TODO: " + command);
		}
	}
	
	public void displayMessage(String message){
		//System.out.println(message);
	}
	
	public void displayError(String message){
		//System.out.println(message);
	}

	@Override
	public void onError(WebSocket conn, Exception ex) {
		ex.printStackTrace();
	}
	
	//Seperate functions to deal with larger responses to certain messages
	public JSONArray ListDevices(JSONObject data){
		System.out.println("searching for lego bricks...");
		try{
			brick_devices = brick.FindBricks(true);
	
			JSONArray jsonDevices = new JSONArray();
			if (brick_devices.size() == 0){
				System.out.println("no lego bricks found."); 
				System.out.println("Have you paired one to your computer through the Bluetooth Manager?");
			}
			else System.out.println("found lego bricks:");
			for (Iterator i = brick_devices.iterator(); i.hasNext(); ){
				RemoteDevice d = (RemoteDevice)i.next();
				JSONObject jsonDevice = new JSONObject();
				String name = d.getFriendlyName(false);
				String address = d.getBluetoothAddress();
				jsonDevice.put("name", name);
				jsonDevice.put("address", FormatAddress(address));
				System.out.println("name: " + name + ", address: " + address);
				jsonDevices.add(jsonDevice);
			}
			
			return jsonDevices;
		}catch(Exception e){
			e.printStackTrace();
			return null;
		}
	}
	
	public JSONObject ConnectToDevice(JSONObject data){
		String name = (String)data.get("name");
		String address = (String)data.get("address");
		address = UnformatBluetoothAddress(address);
		
		JSONObject json = new JSONObject();
		if (brick.Connect(address)){
			json.put("connected", true);
			System.out.println("Connection successful");
		}else{
			json.put("connected", false);
			System.out.println("Connection unsuccessful");
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
