import java.awt.Color;
import java.awt.Dimension;
import java.awt.Insets;
import java.awt.Rectangle;
import java.io.IOException;

import javax.swing.JFrame;
import javax.swing.JOptionPane;
import javax.swing.JScrollPane;
import javax.swing.JTextPane;
import javax.swing.border.EmptyBorder;
import javax.swing.text.SimpleAttributeSet;
import javax.swing.text.StyleConstants;
import javax.swing.text.StyledDocument;

public class Main{
	public static int packetNumber = 0;
	
	private JTextPane myTextPane;
	private JScrollPane scrollPane;
	private JFrame mainFrame;
	
	public Main(){
		mainFrame = new JFrame();
		mainFrame.setBounds(new Rectangle(new Dimension(500, 400)));
		mainFrame.setBackground(Color.BLACK);
		mainFrame.setDefaultCloseOperation(JFrame.DO_NOTHING_ON_CLOSE);
		mainFrame.addWindowListener(new java.awt.event.WindowAdapter(){
			@Override
			public void windowClosing(java.awt.event.WindowEvent windowEvent){
				int answer = JOptionPane.showConfirmDialog(mainFrame,
					"Are you sure to close the server?", "Really Closing?",
					JOptionPane.YES_NO_OPTION,
					JOptionPane.QUESTION_MESSAGE);
				if (answer == JOptionPane.YES_OPTION){
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
	
	public void printToCommandPrompt(String msg, Color c){
		System.out.println(msg);
		StyledDocument doc = this.myTextPane.getStyledDocument();
		
		SimpleAttributeSet keyWord = new SimpleAttributeSet();
		StyleConstants.setForeground(keyWord, c);
		
		try{
			doc.insertString(this.myTextPane.getText().length(),  msg+"\n", keyWord);
			this.myTextPane.setCaretPosition(this.myTextPane.getDocument().getLength());
		}catch(Exception e){
			System.out.println(e);
		}
	}
	
	public static void main(String[] args) throws IOException, InterruptedException{
		Main commandPrompt = new Main();
		
		SpherlyWebSocketServer server = new SpherlyWebSocketServer(commandPrompt);
		server.start();
	}
}
