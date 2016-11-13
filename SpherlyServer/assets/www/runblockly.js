function SpheroManager(){};
SpheroManager.sphero = null;
var url = "ws://localhost:8080/sphero";
var offX;
var offY;

SpheroManager.spheroRun;
SpheroManager.spheroCollide;

window.onload = function(){
	//in language.js
	SpheroManager.PopulateLanguageMenu([
		["English", "en.js"],
		["Francais", "fr.js"],
		["Portuguese", "pt.js"]
	]);
	//END LANGUAGE


	window.connection = new SpheroConnection(url);
	SpheroManager.sphero = new Sphero();

	Blockly.JavaScript.addReservedWords('SpheroManager');

	var defaultXml =
		'<xml>' +
		'	<block type="sphero_run" x="260" y="70"></block>' +
		'</xml>';
	SpheroManager.loadBlocks(defaultXml);

	/*$("#codeButton").on("click", function(){
		var generated_code = Blockly.JavaScript.workspaceToCode();
			generated_code += "if (pixly_run) pixly_run();\n";
		$("#dialogBody").html("<pre>" + generated_code + "</pre>");

		$("#titleText").html("Generated JavaScript Code");
		$("#dialog").css("display", "block");
	});*/

	$("#dialogTitle").on('mousedown', function(e){
		document.getElementsByTagName("html")[0].style.cursor = "default";
		document.getElementsByTagName("body")[0].style.cursor = "default";

		var div = $('#dialog');
		offY= e.clientY-parseInt(div.offset().top);
		offX= e.clientX-parseInt(div.offset().left);
		window.addEventListener('mousemove', Utils.divMove, true);

	});
	$("#dialogTitle").on('mouseup', function(e){
		document.getElementsByTagName("html")[0].style.cursor = "";
		document.getElementsByTagName("body")[0].style.cursor = "";
		window.removeEventListener('mousemove', Utils.divMove, true);
	});

	var openHover = function(e, message){
		$("#hoverMessage").css('display', 'block');
		$("#hoverMessage").offset({top: $(e.target).offset().top, left: $(e.target).offset().left+$(e.target).outerWidth(true)});
		$("#hoverMessage").html(message);
	};
	var closeHover = function(e){
		$("#hoverMessage").css('display', 'none');
	};

	//Set up hover messages..
	$("#selectButton").hover(function(e){
		openHover(e, Blockly.Msg.SELECT_ADDRESS_HOVER);
	}, closeHover);
	$("#connectButton").hover(function(e){
		openHover(e, Blockly.Msg.CONNECT_HOVER);
	}, closeHover);
	$("#calibrateButton").hover(function(e){
		openHover(e, Blockly.Msg.CALIBRATE_HOVER);
	}, closeHover);
}

SpheroManager.example_projects = {};

SpheroManager.openProject = function(){
	var message = $(document.createElement("div"));
	message.append(document.createTextNode(Blockly.Msg.SELECT_XML_FILE));
	message.css("margin-top", "-8px");
	var fileinput = $(document.createElement("input"));

	fileinput.attr('type', "file");
	fileinput.attr('accept', "text/plain, text/xml");
	fileinput.on('change', function(e){
		console.log(fileinput);
		var file = fileinput[0].files[0];
		var reader = new FileReader();
		reader.onload = function(e){
			textarea.html(reader.result);
		}
		reader.readAsText(file);
	});
	fileinput.css("margin-bottom", "10px");
	message.append(fileinput);
		message.append(document.createElement("br"));
	message.append(document.createTextNode(Blockly.Msg.CHOOSE_EXAMPLE));
	var example_select = $(document.createElement("select"));
	var options_array = [
		["", ""],
		[Blockly.Msg.EXAMPLE_TURNING, "turning"],
		[Blockly.Msg.EXAMPLE_ABOUT_FACE, "about_face"],
		[Blockly.Msg.EXAMPLE_ABOUT_FACE_COLLISION, "about_face_collision"],
		[Blockly.Msg.EXAMPLE_CALIBRATE, "calibrate_demo"],
		[Blockly.Msg.EXAMPLE_COLOR_CYCLE, "color_test"],
		[Blockly.Msg.EXAMPLE_ROLL_SQUARE, "square"],
		[Blockly.Msg.EXAMPLE_ROLL_SQUARE_SPIRAL, "square_spiral"]
	];
	for (var i = 0; i < options_array.length; i++){
		var option = $(document.createElement("option"));
		option.attr("value", options_array[i][1]);
		option.html(options_array[i][0]);
		example_select.append(option);
	}
	example_select.on('change', function(e){
		var value = $(example_select).val();
		if (value in SpheroManager.example_projects){
			$(textarea).html(example_projects[value]);
		}else{
			$.get("../demo/"+value+".xml", function(data){
				data = Utils.xmlToString(data);
				SpheroManager.example_projects[value] = data;
				$(textarea).html(data);
			});
		}
	});
	message.append(example_select);
		message.append(document.createElement('br'));

	var textarea = $(document.createElement('textarea'));
	textarea.attr('id', 'dialog_block_xml');
	textarea.css("width", "98%").css("height", "54%").css("margin-top", "5px");

	message.append(textarea);


	var button = $(document.createElement('div'));
	button.html(Blockly.Msg.LOAD_PROJECT);
	button.attr('id', 'dialogButton');
	button.click(function(e){
		var xml = $("#dialog_block_xml").val();
		Blockly.mainWorkspace.clear();
		SpheroManager.loadBlocks(xml);
		Utils.closeDialog();
	});
	button.width(150);

	SpheroManager.alertMessage(Blockly.Msg.OPEN_PROJECT, message, button);
	$("#dialog").height(320);
}

SpheroManager.saveProject = function(){
	var xml = Blockly.Xml.workspaceToDom(Blockly.mainWorkspace);
	xml = Blockly.Xml.domToPrettyText(xml);

	var message = $(document.createElement("div"));
	message.append(document.createTextNode(Blockly.Msg.FILENAME));
	var filename = $(document.createElement("input"));
	filename.attr("type", "text");
	filename.attr("id", "filename_filename");
	filename.val(Blockly.Msg.SPHEROPROJECT_XML);
	message.append(filename);
		message.append(document.createElement("br"));
	var textarea = $(document.createElement('textarea'));
	textarea.attr('id', 'dialog_block_xml');
	textarea.css("width", "98%").css("height", "56%").css("margin-top", "5px");
	textarea.html(xml);
	message.append(textarea);

	var button = $(document.createElement('div'));
	button.html(Blockly.Msg.SAVE_PROJECT);
	button.attr('id', 'dialogButton');
	button.click(function(e){
		Utils.createDownloadLink("#export", $("#dialog_block_xml").val(), $("#filename_filename").val());
		$("#export")[0].click();
		Utils.closeDialog();
	});
	button.width(150);

	SpheroManager.alertMessage(Blockly.Msg.SAVE_PROJECT_DOWNLOAD_BLOCKS, message, button);
}

SpheroManager.alertMessage = function(title, message, button){
	$("#titleText").html(title);
	$("#dialogBody").html('');
	$("#dialogBody").append(message);
	$("#dialogBody").append(document.createElement('br'));
	$("#dialogBody").append(button);
	$("#dialog").css("display", "block");
	$("#dialog").width(500);
	$("#dialog").height(300);
	$("#closeDialogButton").off('click');
	$("#closeDialogButton").on("click", Utils.closeDialog);

	//TODO (not good with two button?)
	window.onkeydown = function(e){
		if(!$("input,textarea").is(":focus")){
			if (e.keyCode === 13){
				$("#dialogButton").click();
			}
		}
	}
}

function tryTo(foo){
	if (window.connection.isConnected){
		foo();
	}else{
		window.connection.tryToConnect(foo);
	}
}

SpheroManager.connect = function() {
	var spheroAddress = $("#spheroAddress").val();

	var message = $(document.createElement('div')).attr('id', 'tableWrapper');
	message.html(Blockly.Msg.ATTEMPTING_CONNECTION(spheroAddress));

	var button = $(document.createElement('div')).attr('id', 'dialogButton');
	button.on('click', function(e){
		Utils.closeDialog();
		$("#selectButton").attr('disabled', false);
		$("#connectButton").attr('disabled', false);
		$("#hoverMessage").css('display', 'none');
		SpheroManager.sphero.cancelConnection();
	}).html(Blockly.Msg.CANCEL);
	SpheroManager.alertMessage("Connecting", message, button);

	$("#hoverMessage").css('display', 'none');
	$("#selectButton").attr("disabled", true);
	$("#connectButton").attr("disabled", true);
	SpheroManager.sphero.connect(spheroAddress, 'sphero', function(is_connected, already_connected){
		button = $(document.createElement('div')).attr('id', 'dialogButton');
		button.on('click', function(e){ Utils.closeDialog(); });
		button.html(Blockly.Msg.OK);
		if (!is_connected) {
			message = $(document.createElement('div')).html(Blockly.Msg.CONNECTION_FAILED);

			SpheroManager.alertMessage(Blockly.Msg.NOT_CONNECTED, message, button);
			$("#selectButton").attr("disabled", false);
			$("#connectButton").attr("disabled", false);
			return;
		}

		message = $(document.createElement("div")).html(Blockly.Msg.CONNECTION_SUCCESSFUL);
		SpheroManager.sphero.connectionReset();

		$("#hoverMessage").css('display', 'none');
		$("#selectButton").attr("disabled", true);
		$("#connectButton").attr("disabled", true);
		$("#disconnectButton").attr("disabled", false);
		//$("#spheroHeading").attr("disabled", false);

		$("#calibrateButton").attr("disabled", false);
		$("#runButton").attr("disabled", false);
		$("#stopButton").attr("disabled", false);
		$("#sleepButton").attr("disabled", false);

		SpheroManager.alertMessage(Blockly.Msg.CONNECTED, message, button);
	});
}

var setAddress = null;

SpheroManager.selectSphero = function() {
	SpheroManager.listDevices();
}

SpheroManager.listDevices = function(){
	var message = $(document.createElement('div')).attr('id', 'tableWrapper').html(Blockly.Msg.SEARCHING_FOR_DEVICES);
	var button = $(document.createElement('div')).attr('id', 'dialogButton').html(Blockly.Msg.CANCEL);
	button.on('click', function(e){
		Utils.closeDialog();
		$("#selectButton").attr('disabled', false);
		$("#connectButton").attr('disabled', false);
		SpheroManager.sphero.cancelListSpheros();
	});
	SpheroManager.alertMessage(Blockly.Msg.SELECT_ADDRESS, message, button);

	var addressBox = $("#spheroAddress")[0];
	var tableWrapper = $("#tableWrapper")[0];

	$("#selectButton").attr("disabled", true);
	$("#connectButton").attr("disabled", true);
	SpheroManager.sphero.listSpheros(function(devices){
		devices = JSON.parse(devices);
		setAddress = function(address){
			addressBox.value = address;
			Utils.closeDialog();
		}
		var tableStr = "<table>";
		for (var i = 0; i < devices.length; i++){
			tableStr += "<tr><td><a href='#' onclick='setAddress("+'"'+devices[i]["address"]+'"'+");'>"+devices[i]["name"]+"</href></td><td>"+devices[i]["address"]+"</td></tr>";
		}
		tableStr += "</table>";
		message.html(devices.length.toString()+ Blockly.Msg.DEVICES_FOUND +" <br />"+tableStr);

		button = $(document.createElement('div')).attr('id', 'dialogButton').html("Cancel");
		button.on('click', function(e){
			Utils.closeDialog();
		});

		SpheroManager.alertMessage(Blockly.Msg.SELECT_ADDRESS, message, button);

		$("#hoverMessage").css('display', 'none');
		$("#selectButton")[0].disabled = false;
		$("#connectButton")[0].disabled = false;
	});
}

SpheroManager.disconnect = function() {
	SpheroManager.sphero.disconnect();

	$("#hoverMessage").css('display', 'none');
	$("#selectButton")[0].disabled = false;
	$("#connectButton")[0].disabled = false;
	$("#disconnectButton")[0].disabled = true;
	$("#calibrateButton")[0].disabled = true;
	//$("#spheroHeading")[0].disabled = true;
	$("#runButton")[0].disabled = true;
	$("#stopButton")[0].disabled = true;
	$("#sleepButton")[0].disabled = true;
}

SpheroManager.sleep = function(){
	SpheroManager.sphero.sleep();

	$("#hoverMessage").css('display', 'none');
	$("#selectButton")[0].disabled = false;
	$("#connectButton")[0].disabled = false;
	$("#disconnectButton")[0].disabled = true;
	$("#calibrateButton")[0].disabled = true;
	//$("#spheroHeading")[0].disabled = true;
	$("#runButton")[0].disabled = true;
	$("#stopButton")[0].disabled = true;
	$("#sleepButton")[0].disabled = true;
}

SpheroManager.loadBlocks = function(defaultXml){
  try {
    var loadOnce = window.sessionStorage.loadOnceBlocks;
  } catch(e) {
    // Firefox sometimes throws a SecurityError when accessing sessionStorage.
    // Restarting Firefox fixes this, so it looks like a bug.
    var loadOnce = null;
  }
  if ('BlocklyStorage' in window && window.location.hash.length > 1) {
    // An href with #key trigers an AJAX call to retrieve saved blocks.
    BlocklyStorage.retrieveXml(window.location.hash.substring(1));
  } else if (loadOnce) {
    // Language switching stores the blocks during the reload.
    delete window.sessionStorage.loadOnceBlocks;
    var xml = Blockly.Xml.textToDom(loadOnce);
    Blockly.Xml.domToWorkspace(Blockly.mainWorkspace, xml);
  } else if (defaultXml) {
    // Load the editor with default starting blocks.
    var xml = Blockly.Xml.textToDom(defaultXml);
    Blockly.Xml.domToWorkspace(Blockly.mainWorkspace, xml);
  } else if ('BlocklyStorage' in window) {
    // Restore saved blocks in a separate thread so that subsequent
    // initialization is not affected from a failed load.
    window.setTimeout(BlocklyStorage.restoreBlocks, 0);
  }
};

SpheroManager.calibrate = function(){
	SpheroManager.sphero.clearEventHandlers();
	SpheroManager.sphero.clearAllCommands();
	SpheroManager.sphero.beginCalibrationMode();

	var message = $(document.createElement('div')).html(Blockly.Msg.CALIBRATE_MESSAGE);
	var button = $(document.createElement('div')).attr('id', 'dialogButton').width(200).html(Blockly.Msg.END_CALIBRATE);

	var endCalibration = function(e){
		$("#calibrateButton")[0].onclick = function(){
			tryTo(SpheroManager.calibrate)
		};
		$("#calibrateButton").html(Blockly.Msg.CALIBRATE);
		SpheroManager.sphero.endCalibrationMode();
		Utils.closeDialog();
	};
	SpheroManager.alertMessage("Calibrate Sphero", message, button);

	button.on('click', endCalibration);
	$("#calibrateButton")[0].onclick = endCalibration;
	$("#calibrateButton").html(Blockly.Msg.END_CALIBRATE);
	$("#closeDialogButton").on("click", endCalibration);
};
