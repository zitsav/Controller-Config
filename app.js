const http = require('http');
const socketIO = require('socket.io');
const keypress = require('keypress');
const cors = require('cors');

const httpServer = http.createServer();
const io = socketIO(httpServer, { cors: { origin: '*' } });

httpServer.listen(2550, () => console.log('Server is running on port 2550'));

io.on('connection', handleUserConnection);

function handleUserConnection(socket) {
  console.log('A user connected');

  setupKeypressListener();

  socket.on('disconnect', () => console.log('User disconnected'));

  function setupKeypressListener() {
    keypress(process.stdin);
    process.stdin.on('keypress', handleKeypress);

    process.stdin.setRawMode(true);
    process.stdin.resume();
  }

  function handleKeypress(ch, key) {
    if (key) {
      const pressedKey = key.name;
      console.log('Received key press from console:', pressedKey);

      if (['w', 'a', 's', 'd', 'q'].includes(pressedKey)) {
        io.emit('keyPress', pressedKey);
      } else {
        console.log('Invalid key input from console:', pressedKey);
      }
    }
  }
}