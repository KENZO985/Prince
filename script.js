// Tic Tac Toe
const cells = document.querySelectorAll('[data-cell]');
const message = document.getElementById('ticMessage');
let turn = 'X';
const winCombos = [
  [0,1,2],[3,4,5],[6,7,8],
  [0,3,6],[1,4,7],[2,5,8],
  [0,4,8],[2,4,6]
];
cells.forEach((c)=>c.addEventListener('click', handleTTT, { once: true }));
function handleTTT(e) {
  const cell = e.target;
  cell.textContent = turn;
  if (winCombos.some(combo => combo.every(i=> cells[i].textContent === turn))) {
    message.textContent = `${turn} wins!`;
    return;
  }
  if ([...cells].every(c=>c.textContent)) {
    message.textContent = 'Draw!';
    return;
  }
  turn = (turn === 'X') ? 'O' : 'X';
}

// Memory Match
const memoryGame = document.getElementById('memoryGame');
const emojis = ['🍕','🍔','🍟','🌮','🍩','🍪','🍫','🍿'];
let cards = [...emojis, ...emojis].sort(()=>0.5 - Math.random());
let flipped = [];
cards.forEach(val => {
  const card = document.createElement('div');
  card.className = 'memory-card';
  card.textContent = '❓';
  card.dataset.val = val;
  card.addEventListener('click', () => {
    if (flipped.length === 2 || card.textContent !== '❓') return;
    card.textContent = val;
    flipped.push(card);
    if (flipped.length === 2) {
      setTimeout(()=>{
        if(flipped[0].dataset.val !== flipped[1].dataset.val) {
          flipped.forEach(c=>c.textContent = '❓');
        }
        flipped = [];
      },800);
    }
  });
  memoryGame.appendChild(card);
});
