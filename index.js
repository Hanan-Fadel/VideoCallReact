const app = require('express')(); // create app
const server = require("http").createServer(app); // create server
const cors = require('cors');                       // create cors that works as middleware that enables cross origins

//Create a server side instance of socket.io
const io = require('socket.io')(server, {
    cors: {
            origin: '*', //accept requests from all origins
            methods: ['GET', 'POST']
    }
});

app.use(cors()); // use cors for requests


// create our port
const PORT = process.env.PORT || 5000; 

// create the routes
app.get("/", (req, res) => {
    res.send('Server is running');  // when somone access our server or localhost:5000 he will get that message
});

io.on('connection', (socket) => {
    
    socket.emit('me', socket.id);

    socket.on('disconnect', () => {
        socket.broadcast.emit("callended");
    });

    socket.on("calluser", ( { userToCall, signalData, from, name } ) => {
        io.to(userToCall).emit("calluser", { signal: signalData, from, name});
    });

    socket.on("answercall", (data) => {
        io.to(data.to).emit("callaccepted", data.signal);
    });

});

server.listen(PORT, () => console.log(`Server listening on port ${PORT}`));
