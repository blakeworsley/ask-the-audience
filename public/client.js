const socket = io();

const connectionCount = document.getElementById('connection-count');
const statusMessage = document.getElementById('status-message');
const buttons = document.querySelectorAll('#choices button');
const totalA = document.querySelector('.total-a');
const totalB = document.querySelector('.total-b');
const totalC = document.querySelector('.total-c');
const totalD = document.querySelector('.total-d');
const voteAlert = document.getElementById('vote-alert');

socket.on('usersConnected', (count) => {
  connectionCount.innerText = 'Connected Users: ' + count;
});

socket.on('statusMessage', (message) => {
  statusMessage.innerText = message;
});

for (let i = 0; i < buttons.length; i++) {
  buttons[i].addEventListener('click', function() {
    socket.send('voteCast', this.innerText);
  });
};

socket.on('votesCount', function(votes) {
  totalA.innerText = 'Total A: ' + votes.A;
  totalB.innerText = 'Total B: ' + votes.B;
  totalC.innerText = 'Total C: ' + votes.C;
  totalD.innerText = 'Total D: ' + votes.D;
});

socket.on('userVoted', function(message) {
  voteAlert.innerText = 'You voted for: ' + message;
  selectButton(message);
});

function selectButton(letter) {
  for (let i = 0; i < buttons.length; i++) {
    buttons[i].classList.remove('button-selected');
  };
  if(letter === 'A'){
    return buttons[0].classList.add('button-selected')
  }
  if(letter === 'B'){
    return buttons[1].classList.toggle('button-selected')
  }
  if(letter === 'C'){
    return buttons[2].classList.toggle('button-selected')
  }
  if(letter === 'D'){
    return buttons[3].classList.toggle('button-selected')
  }
}

