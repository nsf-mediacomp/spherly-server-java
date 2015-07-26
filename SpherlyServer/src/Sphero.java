import java.io.IOException;
import java.io.PrintWriter;
import java.io.StringWriter;
import java.util.Iterator;
import java.util.Vector;

import javax.bluetooth.RemoteDevice;

import org.java_websocket.WebSocket;


public class Sphero {
	private int id;
    private byte packet_number = 0;
    private boolean is_connected = false;
    private boolean enable_collision_detection = false;
    private SpheroHandler OnCollision = null;
    private boolean enable_power_notification = false;
    private SpheroHandler OnPowerNotification = null;
    private SpheroHandler OnConnectionErrorNotification = null;
    private SpherlyWebSocketServer server = null;
    private String address = "";
    private int test_error_limit = 0;
    private int test_error_counter = 0;

    //private onCollision
    private int heading = 0;
    
    public Thread connectionThread;

    public Sphero(SpherlyWebSocketServer server, int id) {
    	this.id = id;
        is_connected = false;
        enable_collision_detection = false;
        OnCollision = null;
        enable_power_notification = false;
        OnPowerNotification = null;
        heading = 0;
        this.server = server;
    }

    public static Vector<RemoteDevice> FindSpheros(boolean filter, SpherlyWebSocketServer server) {
        Vector<RemoteDevice> devices;
        try {
            devices = server.comm.findDevices();
            if (!filter) return devices;
            Vector<RemoteDevice> spheros = new Vector<RemoteDevice>();
            for (Iterator<RemoteDevice> i = devices.iterator(); i.hasNext(); ) {
                RemoteDevice device = i.next();
                if (device.getFriendlyName(false).contains("Sphero")) {
                    spheros.add(device);
                }
            }
            return spheros;
        } catch (Exception e) {
            StringWriter sw = new StringWriter();
            PrintWriter pw = new PrintWriter(sw);
            e.printStackTrace(pw);
            server.displayError(sw.toString());
            return null;
        }
    }

    public boolean connect(/*RemoteDevice device/**/String address/**/) {
        if (server.comm.connect(address)) {
        	this.address = address;
            is_connected = true;
            startListening();
            OnCollision = null;
            heading = 0;
            setHeading(heading);
            return true;
        } else {
            return false;
        }
    }
    
    public boolean reconnect(){
    	if (server.comm.connect(this.address)){
    		is_connected = true;
    		return true;
    	}else{
    		return false;
    	}
    }

    public void disconnect() {
        is_connected = false;
        server.webclientConnectedToSphero = false;
        server.comm.disconnect();
    }

    public boolean isConnected() {
        is_connected = server.comm.isConnected();
        return is_connected;
    }

    public void incPacketNum() {
        packet_number++;
        packet_number %= 256;
    }

    public void clearPacketNum() {
        packet_number = 0;
    }

    public byte[] buildCommand(byte device, byte command, byte[] data, boolean answer) {
        byte sop1 = (byte) 255;
        byte sop2 = (byte) 254;
        if (answer)
            sop2++;
        byte seq = packet_number;
        incPacketNum();
        byte dlen = (byte) (data.length + 1);
        byte dataSum = 0;
        for (int i = 0; i < data.length; i++) {
            dataSum += data[i];
        }
        byte chk = (byte) ((device + command + seq + dlen + dataSum) % 256);
        chk ^= 0xFF;
        byte packet[] = new byte[data.length + 7];
        packet[0] = sop1;
        packet[1] = sop2;
        packet[2] = device;
        packet[3] = command;
        packet[4] = seq;
        packet[5] = dlen;
        for (int i = 0; i < data.length; i++) {
            packet[6 + i] = data[i];
        }
        packet[packet.length - 1] = chk;
        return packet;
    }

    public void setHeading(int heading) {
    	this.heading = heading;
        byte device = 0x02;
        byte command = 0x01;
        byte lsbHeading = (byte) (heading % 256);
        byte msbHeading = (byte) (heading >> 8);
        byte[] data = new byte[]{msbHeading, lsbHeading};
        byte[] packet = buildCommand(device, command, data, false);
        server.comm.write(packet);
    }

    public void resetHeading(){
        heading = 0;
        setHeading(0);
    }

    public void setRGB(int red, int green, int blue) {
        byte device = 0x02;
        byte command = 0x20;
        byte flag = 0;
        byte[] data = new byte[]{(byte) red, (byte) green, (byte) blue, flag};
        byte[] packet = buildCommand(device, command, data, false);
        server.comm.write(packet);
    }

    public void rollForward(int speed) {
        rollForward(speed, 1);
    }

    public void rollForward(int speed, int state) {
        roll(heading, speed, state);
    }

    public void roll(int heading, int speed) {
        heading = (((heading % 360) + 360) % 360);
        roll(heading, speed, 1);
    }

    public void roll(int heading, int speed, int state) {
        byte device = 0x02;
        byte command = 0x30;
        byte lsbHeading = (byte) (heading % 256);
        byte msbHeading = (byte) (heading >> 8);
        byte[] data = new byte[]{
                (byte) speed, msbHeading, lsbHeading, (byte) state
        };
        byte[] packet = buildCommand(device, command, data, false);
        server.comm.write(packet);
    }

    public void turn(int direction) {
        heading += direction;
        heading = (((heading % 360) + 360) % 360);
        roll(heading, 0, 1);
    }

    public void setRotationRate(int rate) {
        byte device = 0x02;
        byte command = 0x03;
        byte[] data = new byte[]{(byte) rate};
        byte[] packet = buildCommand(device, command, data, false);
        server.comm.write(packet);
    }

    public void stop() {
        roll(heading, 0);
    }

    public void setStabilization(boolean flag) {
        byte device = 0x02;
        byte command = 0x02;

        int flag_data = 0;
        if (flag) {
            flag_data = 1;
        }

        byte[] data = new byte[]{(byte) flag_data};
        byte[] packet = buildCommand(device, command, data, false);
        server.comm.write(packet);
    }

    public void calibrate(boolean flagOn) {
        if (flagOn) {
            // enter in the calibration process
            setRGB(0, 0, 0);
            setBackLED(127);
            resetHeading();
            setStabilization(false);

        } else {
            // stop the calibration process
            setBackLED(0);
            setRGB(127, 127, 127);
            resetHeading();
            setStabilization(true);
        }
    }


    public void setInactivityTimeout(int time) {
        byte device = 0x00;
        byte command = 0x25;
        byte[] data = new byte[]{(byte) time};
        byte[] packet = buildCommand(device, command, data, false);
        System.out.println("setting inactivity timeout to: " + time + " seconds");
        server.comm.write(packet);
    }

    public void sleep() {
        byte device = 0x00;
        byte command = 0x22;
        byte[] data = new byte[]{0x00, 0x00, 0x00, 0x00, 0x00};
        byte[] packet = buildCommand(device, command, data, false);
        server.comm.write(packet);
    }

    public void setBackLED(int brightness) {
        byte device = 0x02;
        byte command = 0x21;
        byte[] data = new byte[]{(byte) brightness};
        byte[] packet = buildCommand(device, command, data, false);
        server.comm.write(packet);
    }

    //Dealing with responses from the sphero device
    public void enableCollisionDetection(boolean enable) {
        enable_collision_detection = enable;
        byte device = 0x02;
        byte command = 0x12;
        int enable_data = 0;
        if (enable) enable_data = 1;
        byte Xt = 0x32; //play with these values
        byte Yt = 0x32;
        byte Xspd = 0x64;
        byte Yspd = 0x64;
        int dead = 100;

        byte[] data = new byte[]{(byte) enable_data, Xt, Xspd, Yt, Yspd, (byte) dead};
        byte[] packet = buildCommand(device, command, data, false);
        server.comm.write(packet);
    }

    public void enablePowerNotification(boolean enable) {
        enable_power_notification = enable;
        byte device = 0x00;
        byte command = 0x21;
        int enable_data = 0;
        if (enable) enable_data = 1;
        byte[] data = new byte[]{(byte) enable_data};
        byte[] packet = buildCommand(device, command, data, false);
        server.comm.write(packet);
    }

    static class SpheroHandler {
    	WebSocket conn;
    	SpherlyWebSocketServer server;
    	public SpheroHandler(WebSocket conn, SpherlyWebSocketServer server){
    		this.conn = conn;
    		this.server = server;
    	}
        public void handle(){};
        public void handle(boolean data){};
        public void handle(byte data){};
    }

    public void setCollisionHandler(SpheroHandler handler) {
        OnCollision = handler;
    }

    public void setPowerNotificationHandler(SpheroHandler handler) {
        OnPowerNotification = handler;
    }
    
    public void setConnectionErrorHandler(SpheroHandler handler){
    	OnConnectionErrorNotification = handler;
    }

    interface SpheroListener extends Runnable {
        public byte[] readComm(int length) throws IOException;

        public void listen();
    }

    public void startListening() {
        final Sphero self = this;
        SpheroListener listener = new SpheroListener() {
            public byte[] readComm(int length) throws IOException{
                byte[] packet = server.comm.read(length);
                return packet;
            }

            public void listen() {
                displayMessage("listening to sphero...");
                boolean exceptionErrorOccurred = true;
                
                while (exceptionErrorOccurred){
	                while (self.isConnected()) {
	                    try {
	                    	//DEBUGGING CONNECTION ERRORS (stream closed)
	                    	if (test_error_counter < test_error_limit){
	                    		test_error_counter++;
	                    		throw new Exception("Jake Trower - testing stream closed");
	                    	}
	                    	
	                        byte[] header = readComm(5);
	                        /*StringBuilder sb = new StringBuilder();
						    for (byte b : header) {
						        sb.append(String.format("%02X ", b));
						    }
						    displayMessage(sb.toString());*/
	                        //sphero response packet
	                        //http://orbotixinc.github.io/Sphero-Docs/docs/sphero-api/packet-structures.html
	                        if (header == null) continue;
	
	                        byte sop1 = header[0];
	                        byte sop2 = header[1];
	
	                        //malformed packet
	                        if (sop1 != (byte) 0xff) {
	                            continue;
	                        }
	
	                        if (sop2 == (byte) 0xff) { //response
	                            int dlen = header[4];
	                            displayMessage("response. reading: " + dlen);
	                            readComm(dlen);
	                        } else if (sop2 == (byte) 0xfe) { //async packet
	                            byte idCode = header[2];
	
	                            if (idCode == (byte) 0x07) { //collision detection
	                                //displayMessage("Collision detected");
	                                if (self.enable_collision_detection && self.OnCollision != null) {
	                                    self.OnCollision.handle();
	                                }
	                            }
	
	                            int msbDlen = header[3] << 8;
	                            int lsbDlen = header[4];
	                            int dlen = msbDlen + lsbDlen;
	                            byte[] response = readComm(dlen);
	                            if (response == null) continue;
	                            if (idCode == (byte) 0x01) { //power notification!
	                                if (self.enable_power_notification) {
	                                    //displayMessage("Power notification: " + (int)response[0]);
	                                    self.OnPowerNotification.handle(response[0]);
	                                }
	                            }
	                            if (idCode == (byte) 0x07 && response.length >= 12) {
	                                //displayMessage("speed: "+(int)response[11]);
	                            }
	                        }
	                        exceptionErrorOccurred = false;
	                    } catch (Exception e) {
	                        StringWriter sw = new StringWriter();
	                        PrintWriter pw = new PrintWriter(sw);
	                        e.printStackTrace(pw);
	                        server.displayError(sw.toString());
	                        exceptionErrorOccurred = true;
	                    }
	                }
	                if (exceptionErrorOccurred){
	                    self.OnConnectionErrorNotification.handle(self.isConnected());
	                    exceptionErrorOccurred = false;
	                }
                }
          
                displayMessage("end listening...");
            }

            public void run() {
                listen();
            }
        };

        new Thread(listener).start();
    }

    public void displayMessage(String text) {
        server.displayMessage(text);
    }
}
