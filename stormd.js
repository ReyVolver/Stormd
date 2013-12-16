exports.Stormd = Stormd;

function Stormd(config){
	var self = this;

	self.config = {
		channels: ["#stormd"],
		server: "irc.freenode.net",
		botName: "Stormd",
		helpMethod: "public"
		autoEnable : [] // List of modules which will be enable at start
	};

	self.modules = { 
		available: [], 
		enable: [] 
	};

	self.errCode = [
		"already loaded /!\\",
		"Fully loaded o/",
		"... hum ... I don't know this module.",
		"was removed gently (no kittens were armed)",
		"wasn't loaded."
	];

	var tmpMod = require('fs').readdirSync('./modules');
	while(tmpMod.length > 0){
		var filename = tmpMod.shift();
		if (filename.indexOf('.js') < 0 ) { continue; }

		mod = require('./modules/' + filename)(self)

		self.modules.available.push(mod);

	}


	self.isMe = function(nick){
		return (nick === self.config.botName)
	}

	self.handleMessage = function(channel, message, nick, msgType){

		var lwcsMsg = message.toLowerCase();
		for (i = 0; i < self.modules.enable.length; i++){
			if (lwcsMsg.indexOf(self.modules.enable[i].simpleTrigger) >= 0){
				var matches = self.modules.enable[i].trigger.exec(message);

				if (matches){
					var say = self.modules.enable[i].doAction(nick, message, matches, channel, self);

					if(typeof say !== undefined){
						var responseType = self.modules.enable[i].responseMethods[msgType] || "pm";
						if (responseType == "pm")
							self.c.say(nick, say);
						else
							self.c.say(channel, say);
					}
				}
			}
		}
	}

	self.loadModule = function(module){
		for (var i = self.modules.enable.length - 1; i >= 0; i--) {
			if (self.modules.enable[i].loadName == module)
				return 0;
		};

		for (var i = self.modules.available.length - 1; i >= 0; i--) {
			if (self.modules.available[i].loadName == module){
				self.modules.enable.push(self.modules.available[i]);
				return 1;
			}
		};
		return 2;
	}

	self.removeModule = function(module){
		for (var i = self.modules.enable.length - 1; i >= 0; i--) {
			if (self.modules.enable[i].loadName == module)
				self.modules.enable.remove(i);
			return 3;
		};
		return 4;
	}

	self.joinChan = function(chan){
		self.c.join(chan);
	}

	self.help = function(nick, from, module){
		if (module === null){
			var msg = "Available modules : ";
			for (var i = self.modules.available.length - 1; i >= 0; i--) {
				msg += self.modules.available[i].loadName + " - ";
			};
			self.c.say(from, msg);
			msg = "Enable modules : ";
			for (var i = self.modules.enable.length - 1; i >= 0; i--) {
				msg +=  elf.modules.enable[i].loadName + " - ";
			};
			self.c.say(from, msg)
		}
		else{
			for (var i = self.modules.available.length - 1; i >= 0; i--) {
				if (self.modules.available[i].loadName == module){
					self.c.say(from, self.modules.available[i].actionName+ " - "+ self.modules.available[i].helpText);
					return;
				}
			};
		}
	}

	self.handleAction = function(message){
		cmd = message.args[1].split(' ');
		cmd = _.flatten(cmd);
		ret = null;
		switch (cmd[1]){
			case 'load':
				ret = self.loadModule(cmd[2]);
				break;
			case 'remove':
				ret = self.removeModule(cmd[2]);
				break;
			case 'join':
				ret = self.joinChan(cmd[2]);
				break;
			case 'help':
				self.help(message.nick, message.args[0], (cmd[2]) ? cmd[2] : null);
				break;
			default:
				self.c.say(message.args[0], "help : !sd [load|remove moduleName] [join #channelName] [help]");
		}
		if (ret !== null)
			self.c.say(message.args[0], cmd[2] + " " + self.errCode[ret]);
	}
};