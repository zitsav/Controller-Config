const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const keypress = require('keypress');
const cors = require('cors');

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

// Enable CORS for Socket.I

app.use(cors()); // Enable CORS for Express app

// io.origins('*:*');

app.get('/', (req, res) => {
  res.send('Server is running');
});

io.on('connection', (socket) => {
  console.log('A user connected');

  keypress(process.stdin);

  process.stdin.on('keypress', (ch, key) => {
    if (key) {
      const pressedKey = key.name;
      console.log('Received key press from console:', pressedKey);

      if (['w', 'a', 's', 'd', 'q'].includes(pressedKey)) {
        io.emit('keyPress', pressedKey);
      } else {
        console.log('Invalid key input from console:', pressedKey);
      }
    }
  });

  process.stdin.setRawMode(true);
  process.stdin.resume();

  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});

const PORT = process.env.PORT || 2550;

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});