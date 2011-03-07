var irc = require('./lib/irc');

var bot = new irc.Client();

// Intentionally Troll rails bridge!
bot.connect('#railsbridge');
