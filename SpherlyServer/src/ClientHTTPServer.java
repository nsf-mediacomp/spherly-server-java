
import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.net.InetSocketAddress;
import java.net.URI;

import com.sun.net.httpserver.*;

public class ClientHTTPServer {
	HttpServer server;
	
	public ClientHTTPServer(int port) throws IOException{
		server = HttpServer.create(new InetSocketAddress(port), 0);
		
		server.createContext("/", new MyHandler());
		
        server.setExecutor(null); // creates a default executor
	}
	
	public void start(){
		server.start();
	}
	
    static class MyHandler implements HttpHandler {
        public void handle(HttpExchange t) throws IOException {
        	
            String root = "/www/";
            
            URI uri = t.getRequestURI();
            
            InputStream fileS = ClientHTTPServer.class.getResourceAsStream(root + uri.getPath());

            if (fileS == null) {
			  String response = "404 (Not Found)\n";
			  t.sendResponseHeaders(404, response.length());
			  OutputStream os = t.getResponseBody();
			  os.write(response.getBytes());
			  os.close();
            } else {
              // Object exists and is a file: accept with response code 200.
              t.sendResponseHeaders(200, 0);
              OutputStream os = t.getResponseBody();
              final byte[] buffer = new byte[0x10000];
              int count = 0;
              while ((count = fileS.read(buffer)) >= 0) {
                os.write(buffer,0,count);
              }
              fileS.close();
              os.close();
            }
        }
    }
}
