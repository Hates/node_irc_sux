var sys = require('sys');
var net = require('net');

exports.Client = Client;

function Client() {
  process.EventEmitter.call(this);
}

Client.prototype.connect = function(channel) {
  var client = net.createConnection(6665, 'chat.freenode.net');
  client.addListener('connect', function() {
    sys.puts("Client connected");
    client.write('NICK YouSuxBot\r\n');
    client.write('USER YouSuxBot 0 * :You Sux\r\n');
    client.write('JOIN ' + channel +'\r\n')
  });

  var buffer = "";
  client.addListener('data', function(data) {
    buffer += data;
    var lines = buffer.split("\r\n");
    lines.forEach(function (line) {
      var message = parseMessage(line);
      if(message.command == undefined) {
        return;
      }
      if(message.command == "PING") {
        client.write('PONG ' + message.args + '\r\n');
      } else if(message.command.indexOf("PRIVMSG") != -1
                  && message.args.indexOf('!sux') != -1) {
        suxor = message.args.split(' ')[1];
        client.write('PRIVMSG #suxtest :' + suxor + ' sucks!\r\n');
      }
    });
  });

  client.addListener('close', function() {
    sys.puts("Client disconnected");
  });
}

function parseMessage(data) {
  dataString = data;
  message = {};
  if(data == "") {
    return message;
  }
  if(data.charAt(0) == ":") {
    dataSplit = dataString.substring(1).split(' ');
    message.prefix = dataSplit.shift();
    dataString = dataSplit.join(' ');
  }
  if(data.indexOf(' :') != -1) {
    dataSplit = dataString.split(' :')
    message.command = dataSplit.shift();
    message.args = dataSplit.join();
  } else {
    message.args = dataString.split();
  }

  sys.puts("-");
  sys.puts("Prefix: " + message.prefix);
  sys.puts("Command: " + message.command);
  sys.puts("Args: " + message.args);
  return message;
};
