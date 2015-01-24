import javax.bluetooth.*;
import javax.microedition.io.Connector;
import javax.microedition.io.StreamConnection;
import java.io.*;
import java.util.Vector;


//http://www.aviyehuda.com/downloads/MyDiscoveryListener.java
public class bluecoveRFCOMM implements DiscoveryListener {
    private Object lock = new Object();
    private Vector<RemoteDevice> devicesDiscovered = new Vector<RemoteDevice>();
    private String connectURL;
    private StreamConnection connection;
    private InputStream input_stream;
    private OutputStream output_stream;
    private SpherlyWebSocketServer server;

    public bluecoveRFCOMM(SpherlyWebSocketServer server) {
        this.server = server;
    }

    public Vector<RemoteDevice> findDevices() throws InterruptedException, BluetoothStateException {
        devicesDiscovered.clear();

        synchronized (lock) {
            boolean started = LocalDevice.getLocalDevice().getDiscoveryAgent().startInquiry(DiscoveryAgent.GIAC, this);
            if (started) {
                System.out.println("wait for device inquiry to complete...");
                lock.wait();
                //System.out.println(devicesDiscovered.size() + " device(s) found");
            }
            return devicesDiscovered;
        }
    }

    public boolean connect(/*RemoteDevice device/**/String address/**/) {
        UUID[] uuidSet = new UUID[1];
        uuidSet[0] = new UUID(0x0003); //RFCOMM
        int[] attrIDs = new int[]{
                0x0100 //Service name
        };

        connectURL = null;
        try {
            //LocalDevice.getLocalDevice().getDiscoveryAgent().searchServices(attrIDs, uuidSet, device, this);

            //synchronized(lock){
            //	lock.wait();
            //String address = device.getBluetoothAddress();
            int connection_type = 1;
            address = "btspp://" + address + ":" + connection_type + ";authenticate=false;encrypt=false;master=false";
            System.out.println("Connecting to address " + address);
            //connection = (StreamConnection)Connector.open(connectURL);
            connectURL = address;
            connection = (StreamConnection) Connector.open(address);
            System.out.println("Successfully connected!");

            input_stream = connection.openInputStream();
            output_stream = connection.openOutputStream();
            return true;
            //}
        } catch (Exception e) {
            StringWriter sw = new StringWriter();
            PrintWriter pw = new PrintWriter(sw);
            e.printStackTrace(pw);
            server.displayError(sw.toString());
            //connection.disconnect(null);
            try {
                connection.close();
            } catch (Exception ex) {
            }
            connection = null;
            connectURL = null;
            return false;
        }
    }

    public void disconnect() {
        if (isConnected()) {
            try {
                //connection.disconnect(null);
                connection.close();
                output_stream.close();
                input_stream.close();
            } catch (Exception e) {
                StringWriter sw = new StringWriter();
                PrintWriter pw = new PrintWriter(sw);
                e.printStackTrace(pw);
                server.displayError(sw.toString());
            }
        }
        connection = null;
    }

    public boolean isConnected() {
        return connection != null;
    }

    public void write(byte[] data) {
        if (!isConnected()) {
            return;
        }

        try {
            output_stream.write(data);
        } catch (IOException e) {
            StringWriter sw = new StringWriter();
            PrintWriter pw = new PrintWriter(sw);
            e.printStackTrace(pw);
            server.displayError(sw.toString());
        }
    }

    public byte[] read(int length) {
        if (!isConnected()) {
            return null;
        }

        try {
            byte[] data = new byte[length];
            int N = input_stream.read(data);
            if (N < 0) N = 0;
            //Enforce the correct number of bytes to be read
            while (N < length) {
                int n = input_stream.read(data, N, length - N);
                if (n >= 0) {
                    N += n;
                }
            }

            return data;
        } catch (Exception e) {
            StringWriter sw = new StringWriter();
            PrintWriter pw = new PrintWriter(sw);
            e.printStackTrace(pw);
            server.displayError(sw.toString());
            return null;
        }
    }

    //********************************************************************/
    public void deviceDiscovered(RemoteDevice btDevice, DeviceClass cod) {
        //System.out.println("Device " + btDevice.getBluetoothAddress() + " found");
        devicesDiscovered.addElement(btDevice);
        /*try{
			System.out.println("	name " + btDevice.getFriendlyName(false));
		}catch(IOException cantGetDeviceName){
		}*/
    }

    public void inquiryCompleted(int discType) {
        System.out.println("Device Inquiry completed!");
        synchronized (lock) {
            lock.notify();
        }
    }

    public void serviceSearchCompleted(int transID, int respCode) {
        System.out.println("Service Search completed!");
        synchronized (lock) {
            lock.notify();
        }
    }

    public void servicesDiscovered(int transID, ServiceRecord[] servRecord) {
        System.out.println("SERVICES DISCOVERED");
        for (int i = 0; i < servRecord.length; i++) {
            String url = servRecord[i].getConnectionURL(ServiceRecord.NOAUTHENTICATE_NOENCRYPT, false);
            if (url == null) continue;
            System.out.println("service found " + url);
            for (int j = 0; j < servRecord[i].getAttributeIDs().length; j++) {
                System.out.println(servRecord[i].getAttributeIDs()[j]);
            }
            //System.out.println("i url: " + url);

            DataElement serviceName = servRecord[i].getAttributeValue(0x0100);
            if (serviceName != null) {
                System.out.println("service " + serviceName.getValue() + " found " + url);

                //if (serviceName.getValue().equals("OBEX Object Push")){
                connectURL = url;
                //}
            } else {
                System.out.println("service found " + url);
            }
        }
    }
}
