import javax.swing.*;
import javax.swing.border.EmptyBorder;
import javax.swing.text.SimpleAttributeSet;
import javax.swing.text.StyleConstants;
import javax.swing.text.StyledDocument;

import java.awt.*;
import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;
import java.io.IOException;
import java.net.BindException;
import java.net.URI;

public class Main implements ActionListener {
    public static int packetNumber = 0;

    private JPanel listPane;
    private JTextPane myTextPane;
    private JScrollPane scrollPane;
    private JButton clientButton;
    private JFrame mainFrame;

    public Main() throws IOException{
    	
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

        clientButton = new JButton("Start Client");
        clientButton.setActionCommand("start_client");
        clientButton.addActionListener(this);
        
        myTextPane = new JTextPane();
        myTextPane.setBackground(Color.BLACK);
        myTextPane.setBackground(Color.WHITE);
        myTextPane.setEditable(false);
        myTextPane.setMargin(new Insets(10, 10, 10, 10));

        scrollPane = new JScrollPane(myTextPane);
        scrollPane.setBackground(Color.BLACK);
        
        JPanel buttonPanel = new JPanel(); // to center button
        buttonPanel.setLayout(new BoxLayout(buttonPanel, BoxLayout.X_AXIS));
        buttonPanel.setBorder(new EmptyBorder(10,10,10,10));
        buttonPanel.add(Box.createHorizontalGlue());
        buttonPanel.add(clientButton);
        buttonPanel.add(Box.createHorizontalGlue());
        
        listPane = new JPanel();
        listPane.setLayout(new BoxLayout(listPane, BoxLayout.Y_AXIS));
        listPane.add(buttonPanel);
        listPane.add(scrollPane);

        mainFrame.add(listPane);
        mainFrame.setVisible(true);
        
    	try{
	    	ClientHTTPServer clientServer = new ClientHTTPServer(8000);
	    	clientServer.start();
    	}catch(IOException e){
	        this.printToCommandPrompt("Failed to start client server! Client will have to be started manually.", Color.RED);
    	}
    }
    
    
    public static void openWebpage(URI uri) throws IOException {
        Desktop desktop = Desktop.isDesktopSupported() ? Desktop.getDesktop() : null;
        if (desktop != null && desktop.isSupported(Desktop.Action.BROWSE)) {
            desktop.browse(uri);
        }
    }
    
	@Override
    public void actionPerformed(ActionEvent event){
    	// Open client button clicked
    	if("start_client".equals(event.getActionCommand())){
    		try{
    			openWebpage(new URI("http://127.0.0.1:8000/index.html"));
    		}catch(Exception e){
    	        this.printToCommandPrompt("Could not open browser!", Color.RED);
    	        this.printToCommandPrompt("Browse to http://127.0.0.1:8000/index.html to connect", Color.RED);
    		}
    	}
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
