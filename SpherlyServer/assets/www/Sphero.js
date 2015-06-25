function SpheroConnection(url) {	
	/* this is essentially a wrapper for the websocket connection.*/
	this.tryToConnect = function(callback){
		this.socket = new WebSocket(this.url);
		this.socket.onopen = function(){
			self.isConnected = true;
			if (callback !== null && callback !== undefined) callback();
		}
		this.socket.onclose = function(){
			self.isConnected = false;
			SpheroManager.disconnect();
			SpheroManager.alertMessage("Server Down", "Error connecting to server.<br/><br/>Server may be down.<br><br>Make sure server is running or download <a href='http://tinyurl.com/spherly-server'>here</a>", "<div id='dialogButton' onclick='Utils.closeDialog();'>OK</div>");			
		}
	}
	//turns the command object into a JSON string before sending
	this.send = function(data) { 
		if (!this.isConnected) return;
	
		if (typeof data === "object") {
			data = JSON.stringify(data);
		}
		console.log(data + ";; " + Date.now());
		this.socket.send(data);
	}
	this.setMessageCallback = function(callback){
		this.socket.onmessage = function(evt){
			callback(evt.data);
		}.bind(this);
	}
	this.setMessageCallbackOnce = function(callback){
		this.socket.onmessage = function(evt){
			callback(evt.data);
			this.destroyMessageCallback();
		}.bind(this);
	}
	this.destroyMessageCallback = function(){
		this.socket.onmessage = function(evt){}
	}
	
	//Init
	var self = this;
	this.url = url;
	this.tryToConnect(null);
	this.isConnected = false;
}

function Sphero(url) {
	self = this;
	this.speed = 255;
	this.power_timeout_id = null;
	this.got_power_notification = false;
	this.power_timeout = 60000;
	this.timeout_id = null;
	this.then = Date.now();
	this.COMMAND_WAIT_TIME = 50;
	this.wait_time = this.COMMAND_WAIT_TIME;
	this.back_led_intensity = 0;
	this.current_colour = Utils.hexToRgb("#ffffff");
	this.command_queue = [];
	
	this.stopHandler = null;
	this.clearEventHandlers = function(){
		this.runHandler = null;
		if (this.collisionHandler !== null)
			this.disableCollisionDetection();
		this.endHandler = null;
	}
	this.collisionHandler = null;
	this.clearEventHandlers();
	this.attachEventHandler = function(event, handler){
		console.log(event);
		switch(event){
			case "RUN":
				this.runHandler = handler;
				break;
			case "COLLISION":
				this.setCollisionDetection(true, handler);
				break;
			case "STOP":
				this.stopHandler = handler;
				break;
			case "END":
				this.endHandler = handler;
				break;
			default: break;
		}
	}
	this.power_notifications = [null, false, false, false, false];
	this.stopPowerNotifications = function(){
		if (this.power_timeout_id !== null)
			window.clearTimeout(this.power_timeout_id);
		this.power_timeout_id = null;
	};
	this.powerNotificationHandler = function(){
		var button = "<div id='dialogButton' onclick='Utils.closeDialog();'>OK</div>";
		/*if (!this.got_power_notification){
			SpheroManager.alertMessage("Sphero Off", "Cannot communicate with Sphero.<br/><br/>It may have shut off due to inactivity, lack of battery charge, or may simply be out of range.<br/><br/>Attempting Reconnection.", button);
			SpheroManager.disconnect();			
			this.stopPowerNotifications();
		}else{*/
			this.power_timeout_id = window.setTimeout(this.powerNotificationHandler.bind(this), this.power_timeout);
		//}
		this.got_power_notification = false;
	};
	
	this.isConnected = false;
	this.testConnection = function() {
		var command = {"command": "test"};
		window.connection.send(command);
	}
	this.listSpheros = function(callback) {
		var command = {"command": "listDevices"};
		window.connection.send(command);
		window.connection.setMessageCallbackOnce(callback);
	}
	this.cancelListSpheros = function(){
		var command = {"command": "cancelListDevices"};
		window.connection.send(command);
		window.connection.setMessageCallback(function(data){
			data = JSON.parse(data);
			console.log(data);
		});
	}
	this.connect = function(address, name, callback) {
		var command = {"command": "connectToDevice", "address": address, "name": name};
		window.connection.send(command);
		window.connection.setMessageCallback(function(data){
			data = JSON.parse(data);
			self.isConnected = data["connected"];
			self.speed = 255;
			callback(self.isConnected);
			window.connection.setMessageCallback(self.spheroMessageCallback.bind(self));
			
			this.got_power_notification = true;
			this.power_timeout_id = window.setTimeout(this.powerNotificationHandler.bind(this), this.power_timeout);
		});
	}
	this.cancelConnection = function(){
		var command = {"command": "cancelConnection"};
		window.connection.send(command);
		window.connection.setMessageCallback(function(data){
			data = JSON.parse(data);
			console.log(data);
		});
		this.stopPowerNotifications();
	}
	
	this.connectionReset = function(){
		this.battery_low_notified = false;
		this.battery_critical_notified = false;
		this.battery_charging_notified = false;
	}
	this.disconnect = function() {
		this.stopPowerNotifications();
		
		this.clearAllCommands();
	
		var command = {"command": "disconnect" };
		self.isConnected = false;
		window.connection.send(command);
		window.connection.destroyMessageCallback();
	}
	this.sleep = function() {
		this.stopPowerNotifications();
		
		this.clearAllCommands();
		
		var command = {"command": "sleep"};
		self.isConnected = false;
		window.connection.send(command);
		window.connection.destroyMessageCallback();
	}
	
	this.beginCalibrationMode = function(){
		var command = {"command": "calibrateOn"};
		window.connection.send(command);
	}
	
	this.endCalibrationMode = function(){
		var command = {"command": "calibrateOff"};
		window.connection.send(command);
	}
	
	//
	//USER COMMANDS
	//
	this.setRGB = function(hex, blockID) {
		this.command_queue.push(["setRGB", hex, blockID]);
	}
	this.turn = function(direction, blockID){
		direction = Math.round(direction);
		this.command_queue.push(["turn", direction, blockID]);
	}
	this.turnTimed = function(direction, time, blockID){
		direction = Math.round(direction);
		time = Math.round(time);
		this.command_queue.push(["turnTimed", direction, time, blockID]);
	}
	this.setStabilization = function(flag, blockID){
		this.command_queue.push(["setStabilization", flag, blockID]);
	}
	this.setSpeed = function(speed, blockID){
		speed = Math.round(speed);
		this.command_queue.push(["setSpeed", speed, blockID]);
	}
	this.roll = function(heading, blockID){
		this.command_queue.push(["roll", heading, blockID]);
	}
	this.rollTimed = function(heading, time, blockID){
		this.command_queue.push(["roll", heading, time, blockID]);
	}
	this.rollForward = function(blockID) {
		this.command_queue.push(["rollForward", blockID]);
	}
	this.rollForwardTimed = function(time, blockID){
		this.command_queue.push(["rollForwardTimed", time, blockID]);
	}
	this.stop = function(blockID) {
		this.command_queue.push(["stop", blockID]);
	}
	this.setHeading = function (heading, blockID) {		
		this.command_queue.push(["setHeading", heading, blockID]);
	}
	this.setBackLED = function (value, blockID) {
		this.command_queue.push(["setBackLED", value, blockID]);
	}
	this.wait = function (seconds, blockID) {
		this.command_queue.push(["wait", seconds, blockID]);
	}
	
	this.timedCalibrate = function(time, blockID){
		this.command_queue.push(["timedCalibrate", time, blockID]);
	}
	
	this.HandleHandler = function(handler){
		//for infinite loops :_)
		try{
			handler();
		}
		catch (e) {
			if (e !== "Infinity"){
				var e = $(document.createTextNode(e));
				console.log(jscode);
				SpheroManager.alertMessage("Error", e, button);
			}
		}
	}
	
	this.spheroMessageCallback = function(data){
		var data = JSON.parse(data);
		if (data['collision']){
			this.collisionDetected(data);
		}else if (data['power']){
			this.got_power_notification = true;
			if (!this.power_notifications[data['data']]){
				var button = "<div id='dialogButton' onclick='Utils.closeDialog();'>OK</div>";
				console.log(data['data']);
				switch (data['data']){
					case 1:
						SpheroManager.alertMessage("Battery Charging", "Sphero's battery is charging.<br/>Disconnecting from Sphero.", button);
						SpheroManager.disconnect();
						this.stopPowerNotifications();
						break;
					case 2:
						break;
					case 3:
						SpheroManager.alertMessage("Battery Low", "Sphero's battery is low.<br/>Consider charging it.", button);
						break;
					case 4:
						SpheroManager.alertMessage("Battery Critical", "Sphero will die soon!<br/>Please charge it.", button);
						break;
				}
			}
		}
	}
	
	this.collisionDetected = function(data){
		console.log("COLLISION DETECTED: " + this.timeout_id + ", " + this.wait_time + ", " + (Date.now() - this.then));
		//no commands in queue or no current timeout
		if (this.timeout_id == null && this.collisionHandler !== null){
			this.HandleHandler(this.collisionHandler);
			this.begin_execute(false);
		}else{					
			//REMEMBER THE OLD COMMANDS
			var commands = this.command_queue.splice(0);
			
			//If the old command was on a timeout, replicate that
			var now = Date.now();
			var delta = now - this.then;
			if (delta < this.wait_time)
				this.wait_time = (this.wait_time - delta);
		
			//GIVE PRECENDENCE TO THE COLLISION DETECTION EVENT
			this.command_queue = [];
			if (this.collisionHandler !== null)
				this.HandleHandler(this.collisionHandler);
			//PUT THE OLD COMMANDS BACK ON
			this.command_queue.push(["wait", (this.wait_time)/1000.0]);
			for (var i = 0; i < commands.length; i++){
				this.command_queue.push(commands[i]);
			}
			
			//Reset the timeout
			this.wait_time = 0;
			clearTimeout(this.timeout_id);
			this.timeout_id = setTimeout(this.execute.bind(this), this.wait_time);
		}
	}
	this.setCollisionDetection = function(value, handler){
		var command = {"command": "setCollisionDetection", "value": value};
		this.collisionHandler = handler;

		//window.connection.destroyMessageCallback();
		window.connection.send(command);
	}
	this.disableCollisionDetection = function(){
		var command = {"command": "setCollisionDetection", "value": false};
		this.collisionHandler = null;
		
		//this.updateConnectionMessageCallback(null);
		window.connection.send(command);
	}
	
	//actual execution and stuff
	this.stopProgram = function(){
		this.command_queue = [];
		clearTimeout(this.timeout_id);
		this.timeout_id = null;
		
		var command = {"command": "stop"};
		window.connection.send(command);
		if (this.stopHandler !== null)
			this.HandleHandler(this.stopHandler);
		this.begin_execute(false);
	}
	
	this.clearAllCommands = function(){
		this.command_queue = [];
		clearTimeout(this.timeout_id);
		this.timeout_id = null;
		
		var command = {"command": "stop"};
		window.connection.send(command);
		var command = {"command": "clear"};
		window.connection.send(command);
	}
	this.begin_execute = function(execute_run_handler){
		this.then = Date.now();
		if (execute_run_handler === undefined)
			execute_run_handler = true;
		if (this.runHandler !== null && execute_run_handler)
			this.HandleHandler(this.runHandler);
		this.timeout_id = setTimeout(this.execute(), 0);
	}
	//EXECUTE FUNCTION. ACTUAL CODE FOR MOST THINGS
	this.execute = function(){
		//Clear the last timeout and empty the id
		clearTimeout(this.timeout_id);
		this.timeout_id = null;
		this.then = Date.now();
		this.wait_time = this.COMMAND_WAIT_TIME;
		
		var command = this.command_queue.shift();
		if (command !== undefined){
			var block_id = command.splice(command.length-1);
			if (block_id !== null){
				Blockly.mainWorkspace.highlightBlock(block_id);
			}
			
			switch(command[0]){
				case "setRGB":
					var hex = command[1];
					while (hex.indexOf("'") >= 0){
						hex = hex.replace("'","");
					}
					var colour = Utils.hexToRgb(hex);
					this.current_colour = colour;
					var command = {"command": "setRGB", 
						"red": colour.r, "green": colour.g, "blue": colour.b};
					window.connection.send(command);
					break;
				case "turn":
					var direction = command[1];
					var command = {"command": "turn", "direction": direction};
					window.connection.send(command);
					break;
				case "turnTimed":
					var direction = command[1];
					var time = command[2]; //in seconds
					this.wait_time = time * 1000;
					wait_time_half = Math.round(this.wait_time / 2);
					this.wait_time = wait_time_half;
					this.timeout_id = setTimeout(function(dir, wait){
						var command = {"command": "turn", "direction": dir};
						window.connection.send(command);
						this.wait_time = wait;
						this.timeout_id = setTimeout(function(){
							this.execute();
						}.bind(this), this.wait_time);
					}.bind(this, direction, wait_time_half), wait_time_half);
					//RETURN HERE TO MAKE THE EXECUTE FUNCTION NOT AUTOMATICALLY EXECUTE THE NEXT COMMAND
					return; 
				case "setStabilization":
					var flag = command[1];
					var command = {"command": "setStabilization", "flag":flag};
					window.connection.send(command);
					break;
				case "setSpeed":
					var speed = command[1];
					speed = Math.abs(speed);
					//set speed as a percentage of 255 (max speed)
					this.speed = Math.floor((speed / 100.0) * 255);
					break;
				case "roll":
					var heading = command[1];
					var command = {"command": "roll", "heading": heading, "speed": this.speed};
					window.connection.send(command);
					break;
				case "rollTimed":
					var heading = command[1];
					var time = command[2]; //in seconds
					var command = {"command": "roll", "heading": heading, "speed": this.speed};
					window.connection.send(command);
					this.timeout_id = setTimeout(function(){
						var command = {"command": "stop"};
						window.connection.send(command);
						this.execute();
					}.bind(this), this.wait_time);
					//RETURN HERE TO MAKE THE EXECUTE FUNCTION NOT AUTOMATICALLY EXECUTE THE NEXT COMMAND
					return; 
				case "rollForward":									
					var command = {"command": "rollForward", "speed": this.speed};
					window.connection.send(command);
					break;
				case "rollForwardTimed":
					var time = command[1]; //in seconds
					this.wait_time = time * 1000;
					var command = {"command": "rollForward", "speed": this.speed};
					window.connection.send(command);
					this.timeout_id = setTimeout(function(){
						var command = {"command": "stop"};
						window.connection.send(command);
						this.execute();
					}.bind(this), this.wait_time);
					//RETURN HERE TO MAKE THE EXECUTE FUNCTION NOT AUTOMATICALLY EXECUTE THE NEXT COMMAND
					return; 
				case "stop":								
					var command = {"command": "stop"};
					window.connection.send(command);
					break;
				case "setHeading":
					var heading = command[1];
					var command = {"command": "setHeading", "heading": heading};
					window.connection.send(command);
					break;
				case "setBackLED":
					var value = command[1];
					this.back_led_intensity = value;
					var command = {"command": "setBackLED", "value": value};
					window.connection.send(command);
					break;
				case "wait":
					var seconds = command[1];
					//PUSH THE TIMEOUT TO THE TIMEOUT ARRAY SO IT CAN BE CLEARED IF THE USER WANTS TO CLEAR ALL COMMANDS
					this.wait_time = seconds * 1000;
					this.timeout_id = setTimeout(this.execute.bind(this), this.wait_time);
					//RETURN HERE TO MAKE THE EXECUTE FUNCTION NOT AUTOMATICALLY EXECUTE THE NEXT COMMAND
					return;
				case "timedCalibrate":
					var time = command[1]; //in seconds
					this.wait_time = time * 1000;
					this.beginCalibrationMode();
					this.timeout_id = setTimeout(function(){
						this.endCalibrationMode();
						this.execute();
					}.bind(this), this.wait_time);
					//RETURN HERE TO MAKE THE EXECUTE FUNCTION NOT AUTOMATICALLY EXECUTE THE NEXT COMMAND
					return; 
				//FOR AFTER THE END PROGRAM EVENT HANDLER
				case "final_end":
					return;
				default:
					break;
			}
			this.timeout_id = setTimeout(this.execute.bind(this), this.wait_time);
		}else{
			if (this.endHandler !== null){
				this.HandleHandler(this.endHandler);
				if (this.command_queue.length > 0){
					this.command_queue.push([null, "final_end"]);
					this.timeout_id = setTimeout(this.execute.bind(this), this.wait_time);
				}
			}
		}
	}
}
