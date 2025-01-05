const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const app = express();
const router = require('./Routes/userRoutes');
const msgRoutes = require('./Routes/messageRoutes');
require('dotenv').config();
const socket = require('socket.io');
const path = require('path')
mongoose.connect("mongodb+srv://jayp74688:OYmPoYtlDCrmGy0Z@chatty.tydd0.mongodb.net/").then(() => {
   
}).catch((err) => {
    console.log(err);
}); 
const _dirname = path.resolve()
app.use(cors());  
app.use(express.json());
app.use("/api/auth", router); 
app.use('/api/message', msgRoutes);

app.use(express.static(path.join(_dirname, '/client/build')));

app.get('*', (req, res)=> {
  res.sendFile(path.resolve(_dirname, 'client','build', 'index.html'));
});

const server = app.listen(5000, () => {
    console.log("server is listening on port 5000")
});

const io = socket(server, {
    cors: {
        origin: '*'
    }
}); 

global.onlineUsers = new Map();

io.on("connection", (socket) => {
    global.chatSocket = socket;
    socket.on('add-user', (userId) => {
        onlineUsers.set(userId, socket.id);
       
    });

    socket.on('send-msg', (data) => {
        const sendUserSocket = onlineUsers.get(data.to);
       
        if(sendUserSocket){
            socket.to(sendUserSocket).emit('msg-recieve', data.message);
        }
           
    });
});