var net = require('net');

exports.getRandomPort = function () {
  return Math.floor(Math.random() * (8000 - 9000)) + 8000;
};

exports.getUnusedPort = function (protocol, found, attempts) {
  if (protocol !== "tcp") {
    throw new Error("Can't find an unused port for protocol " + protocol +
    ". Note: only the TCP protocol is supported.");
  }

  if (typeof attempts === 'undefined' || attempts === null) {
    attempts = 3;
  }

  if (attempts === 0) {
    console.log("WARN: Could not find an unused port. " +
    "Please provide port number in specification, or try again later.");
    found(null);
    return;
  }

  var server = net.createServer(function (socket) { socket.end(); });
  var nextport = exports.getRandomPort();

  server.on ('error', function(e) {
    console.log(attempts);
    setImmediate(exports.getUnusedPort, protocol, found, attempts - 1);
  });

  server.listen(nextport, function () {
    server.close();
    found(nextport);
  });
};

var server = net.createServer(function (socket) { socket.end(); });
server.listen(8000, function () {
  exports.getUnusedPort("tcp", function (myport) {
    console.log(myport);
    server.close();
    if (!myport)
      return;
    var newserver = net.createServer(function (socket) { socket.end(); });
    newserver.listen(myport, function () {
      console.log("newserver listening");
      newserver.close();
    });
  });
});
