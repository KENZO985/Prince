// Tic Tac Toe
const cells = document.querySelectorAll('[data-cell]');
const message = document.getElementById('ticMessage');
let turn = 'X';

function checkWin() {
  const wins = [
    [0,1,2],[3,4,5],[6,7,8],
    [0,3,6],[1,4,7],[2,5,8],
    [0,4,8],[2,4,6]
  ];
  return wins.some(comb => comb.every(i => cells[i].textContent === turn));
}

function checkDraw() {
  return [...cells].every(cell => cell.textContent !== '');
}

function handleClick(e) {
  if (e.target.textContent !== '') return;
  e.target.textContent = turn;
  if (checkWin()) {
    message.textContent = `${turn} wins!`;
    cells.forEach(c => c.removeEventListener('click', handleClick));
  } else if (checkDraw()) {
    message.textContent = "It's a draw!";
  } else {
    turn = turn === 'X' ? 'O' : 'X';
  }
}

cells.forEach(cell => cell.addEventListener('click', handleClick));

// Memory Match
const memoryGame = document.getElementById('memoryGame');
const emojis = ['🍕','🎮','🚀','🐱','💻','🎧','📱','⚡️'];
let cards = [...emojis, ...emojis].sort(() => 0.5 - Math.random());
let firstCard, secondCard;
let lock = false;

cards.forEach(emoji => {
  const div = document.createElement('div');
  div.classList.add('card');
  div.dataset.value = emoji;
  div.textContent = '';
  div.addEventListener('click', () => {
    if (lock || div.classList.contains('matched') || div === firstCard) return;
    div.textContent = emoji;
    if (!firstCard) {
      firstCard = div;
    } else {
      secondCard = div;
      lock = true;
      if (firstCard.dataset.value === secondCard.dataset.value) {
        firstCard.classList.add('matched');
        secondCard.classList.add('matched');
        resetCards();
      } else {
        setTimeout(() => {
          firstCard.textContent = '';
          secondCard.textContent = '';
          resetCards();
        }, 1000);
      }
    }
  });
  memoryGame.appendChild(div);
});

function resetCards() {
  [firstCard, secondCard] = [null, null];
  lock = false;
}
