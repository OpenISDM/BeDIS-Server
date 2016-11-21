// Load the TCP Library
Gateway = require('net');
Client = require('net');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Keep track of the chat clients
var gateways = [];
var clients = [];
// Start a TCP Server
Gateway.createServer(function (socket) {

  // Identify this client
  socket.name = socket.remoteAddress + ":" + socket.remotePort 

  // Put this new client in the list
  gateways.push(socket);

  // Send a nice welcome message and announce
  //socket.write("Welcome " + socket.name + "\n");
  //broadcast(socket.name + " joined the chat\n", socket);

  // Handle incoming messages from clients.
  socket.on('data', function (data) {
    console.log(data);
    console.log("\n");
	clients.forEach(function (client) {
	client.write(data);
});
  });

  // Remove the client from the list when it leaves
  socket.on('end', function () {
    console.log("end\n");
    gateways.splice(gateways.indexOf(socket), 1);
    //broadcast(socket.name + " left the chat.\n");
  });
  
  // Send a message to all clients
  function broadcast(message, sender) {
    gateways.forEach(function (client) {
      // Don't want to send it to sender
      if (client === sender) return;
      client.write(message);
    });
    // Log it to the server output too
    process.stdout.write(message)
  }

}).listen(3333);
Client.createServer(function (socket) {

  // Identify this client
  socket.name = socket.remoteAddress + ":" + socket.remotePort 

  // Put this new client in the list
  clients.push(socket);
  console.log(socket.name + " joined the chat\n", socket);
  // Handle incoming messages from clients.
  socket.on('data', function (data) {
	gateways.forEach(function(gateway){
    console.log(data);
    console.log("\n");
	gateway.write("10");
	gateway.write(data);
});
  });

  // Remove the client from the list when it leaves
  /*socket.on('end', function () {
    console.log("end\n");
    clients.splice(clients.indexOf(socket), 1);
  });*/
   socket.on('close', function () {
    console.log("close\n");
    clients.splice(clients.indexOf(socket), 1);
  });
 

}).listen(3334);

// Put a friendly message on the terminal of the server.
console.log("Server side running at port 3333\n");
console.log("Client side running at port 3334\n");

