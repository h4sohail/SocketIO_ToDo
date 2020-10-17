// Library Imports
const express = require('express')
const app = require('express')();
const http = require('http').Server(app); // Add http to the express instance, this is our "server"
const io = require('socket.io')(http); // Add socketio to the http instance
const port = process.env.PORT || 3000;

// Server side copy of the list
let arrToDo = [];

// To-do item model
class ToDoItem {
	constructor(name, isHightLighted) {
		this.name = name;
		this.light = isHightLighted;
	};
}

// Add some dummy data
const toDo1 = new ToDoItem("Make dinner", false);
const toDo2 = new ToDoItem("Finish the 2406 assignment", true);
const toDo3 = new ToDoItem("Submit the course participation material", true);
arrToDo.push(toDo1);
arrToDo.push(toDo2);
arrToDo.push(toDo3);

// Use json middleware for parsing
app.use(express.json());

// Route for serving the home page
app.get(['/', '/todo.html'], function(req, res) {
  res.sendFile(__dirname + '/todo.html');
});

// Route for serving the client side javascript
app.get('/todo.js', function(req, res) {
  res.sendFile(__dirname + '/todo.js');
});

// Route to serve the server side list
app.get('/list', function(req, res) {
  res.json(arrToDo);
});

// Socket events
io.on('connection', function(socket){
  console.log('a user connected');

  socket.on('disconnect', () => {
    console.log('user disconnected');
  });

  // On item add event, add the item to the server list
  // Emit an event for all connected clients to update their local list
  socket.on('item add', function(itemName){
    const newToDoItem = new ToDoItem(itemName, false);
    arrToDo.push(newToDoItem);
    io.emit('item add', itemName);
  });

  // On item remove event, rebuild the server list with the items that were kept
  // Emit an event for all connected clients to update their local list
  socket.on('item remove', function(newItems){
    arrToDo = []
    newItems.forEach(element => {
      const newItem = new ToDoItem(element.name, element.light)
        arrToDo.push(newItem);
    });
    io.emit('item remove', newItems);
  });
});

// Listen on port and await connections/requests
http.listen(port, function(){
  console.log('listening on *:' + port);
});
