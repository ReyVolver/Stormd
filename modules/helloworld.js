module.exports = function(self){
        return {
                "showInHelp": true,//optional. whether to show this action to users when they type help
                "loadName": "hello",
                "actionName": "Hello World",//optional. name in the help list
                "helpText": "Simple Hello world",//optional. This is just a sample action that can never be triggered because it has no simpleTrigger defined
                "simpleTrigger": "!hello",//required. any of these words will flag this action for consideration
                "trigger": new RegExp(this.simpleTrigger),//optional. the text must match this exactly (this is a regex) in order for doAction to be triggered
                "doAction": function(from, msg, matches, self){return "This is a f*cking simple Hello World !";},//required. can return a string that the bot will use to respond. This happens if the regex evaluates to true
                "responseMethods": {"pm":"pm", "public":"public"}//optional. determines how the bot should respond to each message type
        };
};