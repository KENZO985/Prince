// Ensure DOM is fully loaded before running game scripts
document.addEventListener("DOMContentLoaded", () => {

    // --- Tic Tac Toe Game Logic ---
    const cells = document.querySelectorAll('#ticTacToeBoard .cell'); // Select cells within the specific board
    const ticMessage = document.getElementById('ticMessage');
    const ticTacToeResetBtn = document.getElementById('ticTacToeReset');

    let turn = 'X';
    let gameActive = true;
    const winCombos = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
        [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
        [0, 4, 8], [2, 4, 6]             // Diagonals
    ];

    function startGame() {
        cells.forEach(cell => {
            cell.textContent = ''; // Clear content
            cell.classList.remove('win'); // Remove any win highlighting
            cell.removeEventListener('click', handleTTTClick); // Remove old listeners
            cell.addEventListener('click', handleTTTClick, { once: true }); // Add new listener
        });
        ticMessage.textContent = 'Player X\'s Turn'; // Initial message
        turn = 'X';
        gameActive = true;
    }

    function handleTTTClick(e) {
        const cell = e.target;
        if (!gameActive || cell.textContent !== '') return; // Prevent clicking if game over or cell already filled

        cell.textContent = turn;

        if (checkWin(turn)) {
            ticMessage.textContent = `Player ${turn} wins!`;
            gameActive = false;
            highlightWinningCells(turn);
            return;
        }

        if (checkDraw()) {
            ticMessage.textContent = 'Draw!';
            gameActive = false;
            return;
        }

        turn = (turn === 'X') ? 'O' : 'X';
        ticMessage.textContent = `Player ${turn}'s Turn`;
    }

    function checkWin(currentTurn) {
        return winCombos.some(combo => {
            return combo.every(index => {
                return cells[index].textContent === currentTurn;
            });
        });
    }

    function checkDraw() {
        return [...cells].every(cell => cell.textContent !== '');
    }

    function highlightWinningCells(winningTurn) {
        winCombos.forEach(combo => {
            if (combo.every(index => cells[index].textContent === winningTurn)) {
                combo.forEach(index => cells[index].classList.add('win')); // Add a 'win' class for styling
            }
        });
    }

    // Add a simple style for '.win' class to your style.css
    // .cell.win { background-color: rgba(255, 165, 0, 0.3); } /* Example: subtle orange highlight */


    ticTacToeResetBtn.addEventListener('click', startGame);
    startGame(); // Initialize Tic Tac Toe on page load

    // --- Memory Match Game Logic ---
    const memoryGameContainer = document.getElementById('memoryGame');
    const memoryGameMessage = document.getElementById('memoryGameMessage');
    const memoryGameResetBtn = document.getElementById('memoryGameReset');

    const emojis = ['🍕','🍔','🍟','🌮','🍩','🍪','🍫','🍿'];
    let shuffledCards = [];
    let flippedCards = []; // Stores the 2 cards currently flipped
    let matchedPairs = 0;
    let lockBoard = false; // To prevent rapid clicks during timeout

    function initializeMemoryGame() {
        memoryGameContainer.innerHTML = ''; // Clear previous cards
        shuffledCards = [...emojis, ...emojis].sort(() => 0.5 - Math.random());
        flippedCards = [];
        matchedPairs = 0;
        lockBoard = false;
        memoryGameMessage.textContent = 'Find the matching pairs!';

        shuffledCards.forEach(val => {
            const card = document.createElement('div');
            card.classList.add('memory-card');
            card.dataset.val = val; // Store the emoji value
            card.textContent = '❓'; // Display question mark initially
            card.addEventListener('click', flipCard);
            memoryGameContainer.appendChild(card);
        });
    }

    function flipCard() {
        if (lockBoard) return; // Don't allow clicks if board is locked
        if (this === flippedCards[0]) return; // Prevent double-clicking the same card

        this.textContent = this.dataset.val; // Reveal the emoji
        this.classList.add('flipped'); // Add a class to indicate it's flipped (optional styling)

        flippedCards.push(this);

        if (flippedCards.length === 2) {
            lockBoard = true; // Lock the board
            checkForMatch();
        }
    }

    function checkForMatch() {
        const [card1, card2] = flippedCards;
        if (card1.dataset.val === card2.dataset.val) {
            // It's a match!
            matchedPairs++;
            card1.classList.add('matched');
            card2.classList.add('matched');
            card1.removeEventListener('click', flipCard); // Remove listeners so they can't be clicked again
            card2.removeEventListener('click', flipCard);
            resetBoard();

            if (matchedPairs === emojis.length) {
                memoryGameMessage.textContent = 'Congratulations! You found all pairs!';
            }
        } else {
            // Not a match, flip back after a delay
            setTimeout(() => {
                card1.textContent = '❓';
                card2.textContent = '❓';
                card1.classList.remove('flipped');
                card2.classList.remove('flipped');
                resetBoard();
            }, 1000); // 1 second delay
        }
    }

    function resetBoard() {
        flippedCards = [];
        lockBoard = false;
    }

    memoryGameResetBtn.addEventListener('click', initializeMemoryGame);
    initializeMemoryGame(); // Initialize Memory Game on page load

}); // End of DOMContentLoaded
