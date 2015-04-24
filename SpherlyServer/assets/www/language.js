SpheroManager.PopulateLanguageMenu = function(languages){
	var language_menu = $("#languageMenu");
	
	for (var i = 0; i < languages.length; i++){
		var language_name = languages[i][0];
		var file_name = languages[i][1];
		
		var option = $(document.createElement('option'));
		option.attr('value', file_name);
		option.html(language_name);
		language_menu.append(option);
	}
	language_menu.on('change', function(){
		SpheroManager.UpdateLanguageMessages(this.value);
	});
};

//Note, this changes all the static UI text based on language
//But things like the hover messages and dialogs are dynamically populated, and
//so the references for them for Blockly.Msg are in runblockly.js or runblockly_program_execution.js
SpheroManager.UpdateLanguageMessages = function(file_name){
	//Load the language files to replace all the Blockly.Msg variables
	$.getScript("msg/spherly/" + file_name, function(){
		$.getScript("msg/js/" + file_name, function(){
			//Now, update static UI elements
			$("#title").html(Blockly.Msg.SPHERLY_TITLE);

			$("#openProjectButton").html(Blockly.Msg.OPEN_PROJECT);
			$("#saveProjectButton").html(Blockly.Msg.SAVE_PROJECT);

			$("#selectButton").html(Blockly.Msg.SELECT_ADDRESS);
			$("#connectButton").html(Blockly.Msg.CONNECT);
			$("#disconnectButton").html(Blockly.Msg.DISCONNECT);
			$("#sleepButton").html(Blockly.Msg.SLEEP);
			$("#calibrateButton").html(Blockly.Msg.CALIBRATE);
			
			if (SpheroManager.reset_program_text)
				$("#runButton").html(Blockly.Msg.RESET_PROGRAM);
			else
				$("#runButton").html(Blockly.Msg.RUN_PROGRAM);
			$("#stopButton").html(Blockly.Msg.STOP);

			$("#languageTitle").html(Blockly.Msg.LANGUAGE);	
			
			//Now update existing blocks in the workspace to have the correct language
			var xml = Blockly.Xml.workspaceToDom(Blockly.mainWorkspace);
			xml = Blockly.Xml.domToPrettyText(xml);
			Blockly.mainWorkspace.clear();
			SpheroManager.loadBlocks(xml);
			
			//NOW UPDATE BLOCKLY TREE LABELS
			var labels = $(".blocklyTreeLabel");
			$(labels[1]).html(Blockly.Msg.SPHERO_EVENTS);
			$(labels[2]).html(Blockly.Msg.SPHERO_COMMANDS);
			$(labels[3]).html(Blockly.Msg.LOGIC);
			$(labels[4]).html(Blockly.Msg.LOOPS);
			$(labels[5]).html(Blockly.Msg.MATH);
			$(labels[6]).html(Blockly.Msg.LISTS);
			$(labels[7]).html(Blockly.Msg.COLOUR);
			$(labels[8]).html(Blockly.Msg.VARIABLES);
			$(labels[9]).html(Blockly.Msg.FUNCTIONS);
		});
	});
};