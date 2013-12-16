var irc = require('irc');
var _ = require('underscore');
var bot = require('./Stormd');
var Stormd = new bot.Stormd();

Stormd.c = new irc.Client(Stormd.config.server, Stormd.config.botName, { channels : Stormd.config.channels });

Stormd.c.addListener('join', function(channel, who){
	if (who != Stormd.config.botName)
		bot.say(channel, "Welcome " +who+ " !");

});

Stormd.c.addListener("raw", function(message){
	if (message.args[1])
		if (message.args[1].indexOf('!sd') !== -1){
			cmd = message.args[1].split(' ');
			cmd = _.flatten(cmd);
			ret = null;
			switch (cmd[1]){
				case 'load':
					ret = Stormd.loadModule(cmd[2]);
					break;
				case 'remove':
					ret = Stormd.removeModule(cmd[2]);
					break;
				case 'join':
					ret = Stormd.joinChan(cmd[2]);
					break;
				case 'help':
					Stormd.help(message.nick, message.args[0], (cmd[2]) ? cmd[2] : null);
					break;
				default:
					Stormd.c.say(message.args[0], "help : !sd [load|remove moduleName] [join #channelName] [help]");
			}
			if (ret !== null)
				Stormd.c.say(message.args[0], cmd[2] + " " + Stormd.errCode[ret]);

		}

	if (message.command === "JOIN"){
		console.log("JOIN of ", message.nick);
	}
	if (message.args[1])
		Stormd.handleMessage(message.args[0], message.args[1] , message.nick, 'public');
	
}); 



Array.prototype.remove = function(from, to) {
  var rest = this.slice((to || from) + 1 || this.length);
  this.length = from < 0 ? this.length + from : from;
  return this.push.apply(this, rest);
};
