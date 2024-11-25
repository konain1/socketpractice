
const express = require('express')
const cors = require('cors')
const {createServer} = require('http')
const { Server } = require("socket.io");
const connectDB = require('./config/db')
const app = express();
const authRoute = require('./route/user.route')


require('dotenv').config();

app.use(cors())
app.use(express.json()); // Parse JSON requests
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded requests


app.use('/api/auth/',authRoute)

const httpserver = createServer(app)
const io = new Server(httpserver,{
    cors:{
        origin:process.env.CLIENT_PORT,
        methods:["GET","POST"]
    }
});

connectDB();


let messagesMap = []

// server-side
io.on("connection", (socket) => {
    // console.log(socket.id); // x8WIv7-mJelg7on_ALbx

    socket.on('sent',(data)=>{

        const messageData = {
            id: Date.now(), // Simple unique ID
            text: data.message,
            sender: data.sender || 'Anonymous',
            senderId: socket.id,
            timestamp: new Date().toISOString()
          };

          messagesMap.push(messageData)
          console.log(messageData)
        socket.broadcast.emit('recieve',messageData)
    })

    socket.on('single',(data)=>{
        console.log(data)
        socket.to(data.room).emit('EndToEnd',data)
    })

    socket.on('join_room',(room)=>{
        socket.join(room)
        console.log(`User ${socket.id} joined room ${room}`);
    })

    socket.on("disconnect", () => {
            console.log(socket.id); 
          });
  });
  
//   // client-side
//   socket.on("connect", () => {
//     console.log(socket.id); // x8WIv7-mJelg7on_ALbx
//   });
  
//   
  
const PORT = process.env.PORT || 3300;
httpserver.listen(PORT, () => console.log(`Server running on port ${PORT}`));

// httpserver.listen(process.env.PORT,()=>{console.log('server running on 3300')})