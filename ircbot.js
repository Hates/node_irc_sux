var irc = require('./lib/irc');

var bot = new irc.Client();
bot.connect('#railsbridge');
