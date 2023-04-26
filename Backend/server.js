const express = require('express');
const app = express();
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const cors = require('cors');
const userRoutes = require('./routes/userRoutes');
const chatRoutes = require('./routes/chatRoutes');
const messageRoutes =  require('./routes/messageRoutes');


dotenv.config();

app.get('/', (req, res) => {
    res.send("Hello");
})

app.use(express.json());
app.use(cors());


mongoose.connect(process.env.MONGODB_URL)
  .then(() => {
    console.log('successfully connected to MongoDB');
})
  .catch((error) => {
    console.error('connection error:', error);
});


app.use('/api/user', userRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/message', messageRoutes);


const server = app.listen(process.env.PORT, () => {
    console.log("listening on port " + process.env.PORT);
})

const io = require('socket.io')(server, {
  pingTimeout: 60000,
  cors: {
    origin: 'http://localhost:3000'
  }
})

io.on('connection', (socket) => {
  console.log('a user connected');

  socket.on('setup', (userData) => {
    socket.join(userData._id);
    socket.emit('connected');
  })

  socket.on('join chat', (room) => {
    socket.join(room);
    console.log('user joined room ' + room);
  })

  socket.on('new message', (newMessageReceived) => {
    const chat = newMessageReceived.chat;

    if(!chat.users){
      console.log('chat.users is undefined');
    }

    chat.users.forEach(user => {
      if(user._id == newMessageReceived.sender._id){
        return ;
      }

      socket.in(user._id).emit('message received', newMessageReceived)
    });
  });
});