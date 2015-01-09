import java.io.IOException;

public class Main{
	public static int packetNumber = 0;
	
	public static void main(String[] args) throws IOException, InterruptedException{
		LegoWebSocketServer server = new LegoWebSocketServer();
		server.start();
	}
}
