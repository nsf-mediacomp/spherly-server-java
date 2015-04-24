import javax.swing.*;
import javax.swing.text.SimpleAttributeSet;
import javax.swing.text.StyleConstants;
import javax.swing.text.StyledDocument;
import java.awt.*;
import java.io.IOException;
import java.net.BindException;

public class Main {
    public static int packetNumber = 0;

    private JTextPane myTextPane;
    private JScrollPane scrollPane;
    private JFrame mainFrame;

    public Main() throws IOException {
    	try{
    	ClientHTTPServer clientServer = new ClientHTTPServer(8000);
    	clientServer.start();
    	}catch(IOException e){
    		System.out.println("Failed to start client server... exiting");
    		throw e;
    		//System.exit(0);
    	}
    	
        mainFrame = new JFrame();
        mainFrame.setBounds(new Rectangle(new Dimension(500, 400)));
        mainFrame.setBackground(Color.BLACK);
        mainFrame.setDefaultCloseOperation(JFrame.DO_NOTHING_ON_CLOSE);
        mainFrame.addWindowListener(new java.awt.event.WindowAdapter() {
            @Override
            public void windowClosing(java.awt.event.WindowEvent windowEvent) {
                int answer = JOptionPane.showConfirmDialog(mainFrame,
                        "Are you sure to close the server?", "Really Closing?",
                        JOptionPane.YES_NO_OPTION,
                        JOptionPane.QUESTION_MESSAGE);
                if (answer == JOptionPane.YES_OPTION) {
                    System.exit(0);
                }
            }
        });

        myTextPane = new JTextPane();
        myTextPane.setBackground(Color.BLACK);
        myTextPane.setBackground(Color.WHITE);
        myTextPane.setEditable(false);
        myTextPane.setMargin(new Insets(10, 10, 10, 10));

        scrollPane = new JScrollPane(myTextPane);
        scrollPane.setBackground(Color.BLACK);

        mainFrame.add(scrollPane);
        mainFrame.setVisible(true);
    }

    public void printToCommandPrompt(String msg, Color c) {
        System.out.println(msg);
        StyledDocument doc = this.myTextPane.getStyledDocument();

        SimpleAttributeSet keyWord = new SimpleAttributeSet();
        StyleConstants.setForeground(keyWord, c);

        try {
            doc.insertString(doc.getLength(), msg + "\n", keyWord);
            this.myTextPane.setCaretPosition(doc.getLength());
        } catch (Exception e) {
            System.out.println(e);
        }
    }

    public static void main(String[] args) throws IOException, InterruptedException {
        Main commandPrompt = new Main();

        SpherlyWebSocketServer server = new SpherlyWebSocketServer(commandPrompt);
        server.start();
    }
}
