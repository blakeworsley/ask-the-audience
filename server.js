const http = require('http');
const express = require('express');

const app = express();

let votes = {};

app.use(express.static('public'));

app.get('/', function(req, res){
  res.sendFile(__dirname + '/public/index.html')
})

const port = process.env.PORT || 3000;

const server = http.createServer(app)
              .listen(port, function() {
                console.log('Listening on port ' + port + '.');
              });

const socketIo = require('socket.io');
const io = socketIo(server);

function countVotes(votes) {
  let voteCount = {
    A: 0,
    B: 0,
    C: 0,
    D: 0
  };
  for (var vote in votes) {
    voteCount [votes[vote]]++
  }
  return voteCount;
}

io.on('connection', function (socket) {
  console.log('A user has connected.', io.engine.clientsCount);
  
  io.sockets.emit('usersConnected', io.engine.clientsCount);

  socket.emit('statusMessage', 'You have connected.');

  socket.on('message', (channel, message) => {
    if (channel === 'voteCast') {
      votes[socket.id] = message;
      console.log('votesCount', countVotes(votes));

      io.emit('votesCount', countVotes(votes))
      socket.emit('userVoted', message)
    }
  });

  socket.on('disconnect', () => {
    console.log('A user has disconnected', io.engine.clientsCount);
    delete votes[socket.id];
    socket.emit('votesCount', countVotes(votes));
    io.sockets.emit('userVoted', io.engine.clientsCount);
  });
});

module.exports = server;