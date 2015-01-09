import java.util.Iterator;
import java.util.Vector;

import javax.bluetooth.RemoteDevice;


public class LegoBrick {
	private bluecoveRFCOMM comm;
	private byte packet_number = 0;
	private boolean is_connected = false;
	private boolean enable_power_notification = false;
	private BrickHandler OnPowerNotification = null;
	
	public LegoBrick(LegoWebSocketServer server){
		comm = new bluecoveRFCOMM(server);
		is_connected = false;
		enable_power_notification = false;
		OnPowerNotification = null;
	}
	
	public Vector<RemoteDevice> FindBricks(boolean filter){
		Vector<RemoteDevice> devices;
		try {
			devices = comm.findDevices();
			if (!filter) return devices;
			Vector<RemoteDevice> bricks = new Vector<RemoteDevice>();
			for (Iterator<RemoteDevice> i = devices.iterator(); i.hasNext(); ){
				RemoteDevice device = i.next();
				System.out.println(device.getFriendlyName(false));
				//if (device.getFriendlyName(false).contains("Sphero")){
				bricks.add(device);
				//}
			}
			return bricks;
		} catch (Exception e) {
			e.printStackTrace();
			return null;
		}
	}
	
	public boolean Connect(/*RemoteDevice device/**/String address/**/){
		if (comm.connect(address)){
			is_connected = true;
			StartListening();
			return true;
		}else{
			return false;
		}
	}
	
	public void Disconnect(){
		is_connected = false;
		comm.disconnect();
	}
	
	public boolean IsConnected(){
		is_connected = comm.isConnected();
		return is_connected;
	}
	
	public void IncPacketNum(){
		packet_number++;
		packet_number %= 256;
	}
	
	public void ClearPacketNum(){
		packet_number = 0;
	}
	
	public byte[] BuildCommand(byte device, byte command, byte[] data, boolean answer){
		byte sop1 = (byte)255;
		byte sop2 = (byte)254;
		if (answer)
			sop2++;
		byte seq = packet_number;
		IncPacketNum();
		byte dlen = (byte)(data.length + 1);
		byte dataSum = 0;
		for (int i = 0; i < data.length; i++){
			dataSum += data[i];
		}
		byte chk = (byte)((device + command + seq + dlen + dataSum) % 256);
		chk ^= 0xFF;
		byte packet[] = new byte[data.length+7];
		packet[0] = sop1;
		packet[1] = sop2;
		packet[2] = device;
		packet[3] = command;
		packet[4] = seq;
		packet[5] = dlen;
		for (int i = 0; i < data.length; i++){
			packet[6+i] = data[i];
		}
		packet[packet.length-1] = chk;
		return packet;
	}
	
	public void EnablePowerNotification(boolean enable){
		enable_power_notification = enable;
		byte device = 0x00;
		byte command = 0x21;
		int enable_data = 0;
		if (enable) enable_data = 1;
		byte[] data = new byte[]{ (byte)enable_data};
		byte[] packet = BuildCommand(device, command, data, false);
		comm.write(packet);
	}
	
	interface BrickHandler{
		public void handle();
		public void handle(byte data);
	}
	public void SetPowerNotificationHandler(BrickHandler handler){
		OnPowerNotification = handler;
	}
	
	interface BrickListener extends Runnable{
		public byte[] readComm(int length);
		public void listen();
	}
	public void StartListening(){
		final LegoBrick self = this;
		BrickListener listener = new BrickListener(){
			public byte[] readComm(int length) {
				byte[] packet = comm.read(length);
				return packet;
			}

			public void listen() {
				System.out.println("listening to lego brick...");
				while (self.IsConnected()){
					try{
						byte[] header = readComm(5);
						/*StringBuilder sb = new StringBuilder();
					    for (byte b : header) {
					        sb.append(String.format("%02X ", b));
					    }
					    System.out.println(sb.toString());*/
						//sphero response packet
						//http://orbotixinc.github.io/Sphero-Docs/docs/sphero-api/packet-structures.html
						if (header == null) continue;
						
					    byte sop1 = header[0];
					    byte sop2 = header[1];
						
						//malformed packet
						if (sop1 != (byte)0xff){
							continue;
						}
						
						if (sop2 == (byte)0xff){ //response
							int dlen = header[4];
							System.out.println("response. reading: "+dlen);
							readComm(dlen);
						}else if (sop2 == (byte)0xfe){ //async packet
							byte idCode = header[2];
							
							
							
							int msbDlen = header[3] << 8;
							int lsbDlen = header[4];
							int dlen = msbDlen + lsbDlen;
							byte[] response = readComm(dlen);
							if (response == null) continue;
							if (idCode == (byte)0x01){ //power notification!
								if (self.enable_power_notification){
									//System.out.println("Power notification: " + (int)response[0]);
									self.OnPowerNotification.handle(response[0]);
								}
							}
							if (idCode == (byte)0x07 && response.length >= 12){
								//System.out.println("speed: "+(int)response[11]);
							}
						}
						
					}catch(Exception e){
						e.printStackTrace();
					}
				}
				System.out.println("end listening...");
			}
			
			public void run(){
				listen();
			}
		};
		
		new Thread(listener).start();
	}
}
