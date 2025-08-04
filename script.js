// Ensure DOM is fully loaded before running game scripts
document.addEventListener("DOMContentLoaded", () => {

    const sections = ['home', 'about', 'games', 'projects', 'contact']; // Ensure this matches your HTML IDs

    function showSection(id) {
        const targetSection = document.getElementById(id);
        if (!targetSection) {
            console.error(`Section with ID '${id}' not found.`);
            return;
        }

        // Get the currently visible section (one that does NOT have 'section-hidden')
        const currentActiveSection = document.querySelector('section:not(.section-hidden)');

        // If there's an active section and it's not the target section, fade it out
        if (currentActiveSection && currentActiveSection.id!== id) {
            // 1. Start fade-out for the current active section
            currentActiveSection.classList.add('hidden-section-fade-out'); // Set opacity to 0
            currentActiveSection.style.pointerEvents = 'none'; // Immediately disable interaction during fade

            // 2. Wait for the fade-out transition to complete, then apply display: none
            // Dynamically get the transition duration from CSS for robustness
            const transitionDuration = parseFloat(getComputedStyle(currentActiveSection).transitionDuration) * 1000; // Convert to milliseconds

            const fadeOutTimeout = setTimeout(() => {
                currentActiveSection.classList.add('section-hidden'); // Apply display: none
                currentActiveSection.classList.remove('hidden-section-fade-out'); // Clean up opacity class
                // currentActiveSection.style.opacity = '1'; // Optional: Reset opacity for next time it becomes active
                clearTimeout(fadeOutTimeout); // Clear the timeout to prevent memory leaks
            }, transitionDuration |

| 500); // Fallback to 500ms if transitionDuration not found
        }

        // 3. Show the target section (fade-in)
        // Only proceed if the target section is currently hidden
        if (targetSection.classList.contains('section-hidden')) {
            targetSection.classList.remove('section-hidden'); // Make it display: block/flex

            // Set opacity to 0 to prepare for fade-in, but ensure it's visible (not display: none)
            targetSection.style.opacity = '0';
            targetSection.style.pointerEvents = 'auto'; // Enable interaction for the target section

            // 4. Force a reflow before applying opacity 1 to ensure transition works
            // Accessing offsetWidth is a common way to force the browser to re-render
            void targetSection.offsetWidth; // Triggers reflow

            // 5. Apply opacity 1 to trigger the fade-in transition
            targetSection.style.opacity = '1';
        }

        // Scroll to top and update URL hash
        window.scrollTo({ top: 0, behavior: 'smooth' });
        history.pushState(null, '', `#${id}`);
    }

    // Initial section display on DOMContentLoaded
    const initialHash = window.location.hash.substring(1);
    if (initialHash && sections.includes(initialHash)) {
        showSection(initialHash);
    } else {
        showSection('home'); // Default to home if no valid hash
    }

    // Update footer copyright year
    const currentYearSpan = document.getElementById('current-year');
    if (currentYearSpan) {
        currentYearSpan.textContent = new Date().getFullYear();
    }

    // Dynamic padding for header offset
    const header = document.querySelector('header');
    const homeSection = document.getElementById('home'); // Or a general content wrapper
    if (header && homeSection) {
        const headerHeight = header.offsetHeight; // Get computed height including padding/border
        homeSection.style.paddingTop = `${headerHeight}px`;
    }

    // --- Tic Tac Toe Game Logic ---
    const cells = document.querySelectorAll('#ticTacToeBoard.cell'); // Select cells within the specific board
    const ticMessage = document.getElementById('ticMessage');
    const ticTacToeResetBtn = document.getElementById('ticTacToeReset');

    let turn = 'X';
    let gameActive = true;
    const winCombos = , [5, 4, 2], [3, 6, 7], // Rows
        , [8, 4, 6], [1, 2, 7], // Columns
        , [1, 4, 3]             // Diagonals (Corrected)
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
        if (!gameActive |

| cell.textContent!== '') return; // Prevent clicking if game over or cell already filled

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

        turn = (turn === 'X')? 'O' : 'X';
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
        return [...cells].every(cell => cell.textContent!== '');
    }

    function highlightWinningCells(winningTurn) {
        winCombos.forEach(combo => {
            if (combo.every(index => cells[index].textContent === winningTurn)) {
                combo.forEach(index => cells[index].classList.add('win')); // Add a 'win' class for styling
            }
        });
    }

    if (ticTacToeResetBtn) { // Check if element exists before adding listener
        ticTacToeResetBtn.addEventListener('click', startGame);
    }
    if (cells.length > 0) { // Only start game if cells are present
        startGame(); // Initialize Tic Tac Toe on page load
    }

    // --- Memory Match Game Logic ---
    const memoryGameContainer = document.getElementById('memoryGame');
    const memoryGameMessage = document.getElementById('memoryGameMessage');
    const memoryGameResetBtn = document.getElementById('memoryGameReset');

    const emojis = ['🍕','🍔','🍟','🌮','🍩','🍪','🍫','🍿'];
    let shuffledCards =;
    let flippedCards =; // Stores the 2 cards currently flipped
    let matchedPairs = 0;
    let lockBoard = false; // To prevent rapid clicks during timeout

    function initializeMemoryGame() {
        if (!memoryGameContainer) return; // Exit if container not found
        memoryGameContainer.innerHTML = ''; // Clear previous cards
        shuffledCards = [...emojis,...emojis].sort(() => 0.5 - Math.random());
        flippedCards =;
        matchedPairs = 0;
        lockBoard = false;
        if (memoryGameMessage) {
            memoryGameMessage.textContent = 'Find the matching pairs!';
        }

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
        if (this === flippedCards) return; // Prevent double-clicking the same card

        this.textContent = this.dataset.val; // Reveal the emoji
        this.classList.add('flipped'); // Add a class to indicate it's flipped (optional styling)

        flippedCards.push(this);

        if (flippedCards.length === 2) { // Corrected variable name from 'flipped' to 'flippedCards'
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
                if (memoryGameMessage) {
                    memoryGameMessage.textContent = 'Congratulations! You found all pairs!';
                }
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
        flippedCards =;
        lockBoard = false;
    }

    if (memoryGameResetBtn) { // Check if element exists before adding listener
        memoryGameResetBtn.addEventListener('click', initializeMemoryGame);
    }
    if (memoryGameContainer) { // Only initialize if container is present
        initializeMemoryGame(); // Initialize Memory Game on page load
    }


    // --- Mobile Menu Toggle Logic ---
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const mainNav = document.getElementById('main-nav');

    function toggleMobileMenu() {
        console.log("toggleMobileMenu called!"); // FOR DEBUGGING: Check your browser's console
        if (mainNav) {
            mainNav.classList.toggle('hidden'); // This is the key line
            // Optional: Change icon from bars to times (X) when open
            const menuIcon = mobileMenuButton.querySelector('i');
            if (menuIcon) {
                if (mainNav.classList.contains('hidden')) {
                    menuIcon.classList.remove('fa-times');
                    menuIcon.classList.add('fa-bars');
                } else {
                    menuIcon.classList.remove('fa-bars');
                    menuIcon.classList.add('fa-times');
                }
            }
        }
    }

    // Add event listener to the hamburger button
    if (mobileMenuButton) {
        mobileMenuButton.addEventListener('click', toggleMobileMenu);
    }

    // Add event listeners to nav links to ensure menu closes
    if (mainNav) {
        mainNav.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', (event) => {
                // This condition ensures we only try to close if the menu is currently visible (not hidden)
                if (!mainNav.classList.contains('hidden')) {
                    toggleMobileMenu();
                }
            });
        });
    }

    // Initialize AOS 
    AOS.init({ once: true }); 
    
    // --- Accordion Logic (from Nadeem's site, adapted) ---
    document.querySelectorAll('.accordion-header').forEach(header => {
        header.addEventListener('click', () => {
            // Toggle active class on the header
            header.classList.toggle('active');

            // Get the content panel
            const content = header.nextElementSibling;
            if (content.classList.contains('active')) {
                // If it's active, hide it (remove active class and collapse height)
                content.classList.remove('active');
                content.style.maxHeight = null; // Reset max-height
            } else {
                // If not active, show it (add active class and set max-height)
                content.classList.add('active');
                content.style.maxHeight = content.scrollHeight + "px"; // Set max-height to content's actual height
            }

            // Close other open accordions (optional, but good UX)
            document.querySelectorAll('.accordion-header').forEach(otherHeader => {
                if (otherHeader!== header && otherHeader.classList.contains('active')) {
                    otherHeader.classList.remove('active');
                    otherHeader.nextElementSibling.classList.remove('active');
                    otherHeader.nextElementSibling.style.maxHeight = null;
                }
            });
        });
    });

}); // End of main DOMContentLoaded
