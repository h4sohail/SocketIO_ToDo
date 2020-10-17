# socket_todo
A TO-DO app that uses Express.js and Socket.io    

To test, please run the following commands in the root directory    
```
$ npm install
$ node todo-server.js 
```

Then navigate to http://localhost:3000 to view the app.    

## Files:    

### todo-server.js    
This is the server side logic, using Express.js and Socket.io, this is where all the routes and Socket.io events are registered and handled.

### todo.html    
This is the frontend markup.    

### todo.js    
This is the client side logic, instead of polling, we use web sockets, by using Socket.io, every client connects to the server and emits/listens for events on the network which keeps the local lists up-to date with the server and every other client.     
