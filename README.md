# socket_todo
A TO-DO app that uses Socket.io    

To test, please run the following commands in the /todo-server-socketio/ directory    
```
$ npm install
$ node todo-server.js 
```

Then navigate to localhost:3000 to view the app.    

## Files:    

### todo-server.js    
This is the server side logic, using express.js and socket.io, this is where all the routes and socket.io events are registered and handled. Comparing this to the vanialla "http" version of this app, we can see just how much cleaner our code gets when we use express and socketio!    

### todo.html    
This is the frontend markup    

### todo.js    
This is the client side logic, instead of polling, we now use web sockets, by using socket.io, every client connects to the server and emits/listens for events on the network which keeps the local lists upto date with the server and every other client.     
