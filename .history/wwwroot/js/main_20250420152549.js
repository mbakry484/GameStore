document.addEventListener('DOMContentLoaded', function () {
    // Store API reference for convenience
    const api = window.gameStoreApi;

    // DOM Elements
    const gamesContainer = document.getElementById('games-container');
    const genresContainer = document.getElementById('genres-container');
    const genreFilter = document.getElementById('genre-filter');
    const sortOptions = document.getElementById('sort-options');
    const loadMoreBtn = document.getElementById('load-more-btn');
    const searchInput = document.getElementById('search-input');
    const searchBtn = document.getElementById('search-btn');
    const browseGamesBtn = document.getElementById('browse-games-btn');

    // Templates
    const gameCardTemplate = document.getElementById('game-card-template');
    const genreCardTemplate = document.getElementById('genre-card-template');

    // Game Details Modal
    const modal = document.getElementById('game-details-modal');
    const closeModal = document.querySelector('.close-modal');

    // Cart state
    const cartCount = document.querySelector('.cart-count');
    let itemsInCart = 0;

    // Page state
    let currentPage = 1;
    const gamesPerPage = 4;
    let currentFilters = {};
    let allGames = [];

    // Initialize the UI
    init();

    // Functions
    async function init() {
        // Load all games and genres
        try {
            await loadGenres();
            await loadGames();

            // Set up event listeners
            setupEventListeners();

            // Hero section blur control
            setupBlurControl();
        } catch (error) {
            showNotification('Error loading data: ' + error.message, 'error');
        }
    }

    async function loadGames(filters = {}) {
        try {
            // Show loading state
            gamesContainer.innerHTML = '<div class="loading">Loading games...</div>';

            // Get games from API
            currentFilters = { ...filters };
            allGames = await api.getGames(currentFilters);

            // Clear container
            gamesContainer.innerHTML = '';

            // Display first page of games
            displayGames(allGames.slice(0, gamesPerPage));

            // Show/hide load more button
            toggleLoadMoreButton();
        } catch (error) {
            showNotification('Error loading games: ' + error.message, 'error');
        }
    }

    function displayGames(games) {
        // No games found
        if (games.length === 0) {
            gamesContainer.innerHTML = '<div class="no-results">No games found</div>';
            return;
        }

        // Create a document fragment to improve performance
        const fragment = document.createDocumentFragment();

        games.forEach(game => {
            // Clone the template
            const gameCard = gameCardTemplate.content.cloneNode(true);
            const card = gameCard.querySelector('.game-card');

            // Set data attribute for game ID
            card.dataset.gameId = game.id;

            // Set game details
            card.querySelector('.game-title').textContent = game.name;
            card.querySelector('.game-genre').textContent = game.genreName;
            card.querySelector('.game-price').textContent = `$${game.price.toFixed(2)}`;

            // Set game image if available
            const imgElement = card.querySelector('.game-image img');
            if (game.photoUrl) {
                imgElement.src = game.photoUrl;
                imgElement.alt = game.name;
            } else {
                imgElement.src = 'https://via.placeholder.com/300x180?text=No+Image';
                imgElement.alt = 'No Image Available';
            }

            // Set up event listeners for this card
            setupGameCardListeners(card, game);

            // Add to fragment
            fragment.appendChild(card);
        });

        // Append all cards at once
        gamesContainer.appendChild(fragment);
    }

    function setupGameCardListeners(card, game) {
        // View details button
        const viewBtn = card.querySelector('.btn-view');
        viewBtn.addEventListener('click', () => showGameDetails(game));

        // Add to cart button
        const addToCartBtn = card.querySelector('.btn-add-cart');
        addToCartBtn.addEventListener('click', () => addToCart(game.id));
    }

    async function loadGenres() {
        try {
            // Get genres from API
            const genres = await api.getGenres();

            // Populate genre filter dropdown
            populateGenreFilter(genres);

            // Display genre cards
            displayGenres(genres);
        } catch (error) {
            showNotification('Error loading genres: ' + error.message, 'error');
        }
    }

    function populateGenreFilter(genres) {
        // Clear existing options except the first one
        while (genreFilter.options.length > 1) {
            genreFilter.remove(1);
        }

        // Add genres to filter
        genres.forEach(genre => {
            const option = document.createElement('option');
            option.value = genre.id;
            option.textContent = genre.name;
            genreFilter.appendChild(option);
        });
    }

    function displayGenres(genres) {
        // Clear container
        genresContainer.innerHTML = '';

        // Create a document fragment
        const fragment = document.createDocumentFragment();

        // Genre icons mapping (Font Awesome icons)
        const genreIcons = {
            'Action': 'fas fa-gamepad',
            'RPG': 'fas fa-dragon',
            'Adventure': 'fas fa-route',
            'Racing': 'fas fa-car',
            'Horror': 'fas fa-ghost',
            'Strategy': 'fas fa-chess',
            // Default icon for any other genre
            'default': 'fas fa-dice-d20'
        };

        genres.forEach(genre => {
            // Clone the template
            const genreCard = genreCardTemplate.content.cloneNode(true);
            const card = genreCard.querySelector('.genre-card');

            // Set data attribute for genre ID
            card.dataset.genreId = genre.id;

            // Set genre details
            card.querySelector('.genre-name').textContent = genre.name;
            card.querySelector('.game-count').textContent = `${genre.gameCount} Games`;

            // Set icon based on genre name
            const iconElement = document.createElement('i');
            iconElement.className = genreIcons[genre.name] || genreIcons.default;
            card.querySelector('.genre-icon').appendChild(iconElement);

            // Add event listener to filter games by this genre
            card.addEventListener('click', () => {
                // Update genre filter dropdown
                genreFilter.value = genre.id;

                // Load games with this genre
                loadGames({ genreId: genre.id });

                // Scroll to games section
                document.getElementById('games').scrollIntoView({
                    behavior: 'smooth'
                });
            });

            // Add to fragment
            fragment.appendChild(card);
        });

        // Append all cards at once
        genresContainer.appendChild(fragment);
    }

    function showGameDetails(game) {
        // Update modal content
        document.getElementById('detail-title').textContent = game.name;
        document.getElementById('detail-genre').querySelector('span').textContent = game.genreName;

        // Set game image if available
        const detailImg = document.querySelector('.game-detail-image img');
        if (game.photoUrl) {
            detailImg.src = game.photoUrl;
            detailImg.alt = game.name;
        } else {
            detailImg.src = 'https://via.placeholder.com/600x300?text=No+Image';
            detailImg.alt = 'No Image Available';
        }

        // Format the release date
        const releaseDate = new Date(game.releaseDate);
        const formattedDate = releaseDate.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
        document.getElementById('detail-release').querySelector('span').textContent = formattedDate;

        // Set price
        document.getElementById('detail-price').textContent = `$${game.price.toFixed(2)}`;

        // Set game ID on add to cart button
        const addToCartBtn = document.querySelector('.add-to-cart-detail');
        addToCartBtn.dataset.gameId = game.id;

        // Show modal
        modal.style.display = 'block';
        document.body.style.overflow = 'hidden'; // Prevent scrolling
    }

    async function addToCart(gameId) {
        try {
            // Call API to add to cart
            const result = await api.addToCart(gameId);

            if (result.success) {
                // Update cart count
                itemsInCart++;
                cartCount.textContent = itemsInCart;

                // Animate cart count
                cartCount.classList.add('pulse');
                setTimeout(() => {
                    cartCount.classList.remove('pulse');
                }, 300);

                // Show notification
                showNotification(result.message);
            }
        } catch (error) {
            showNotification('Error adding to cart: ' + error.message, 'error');
        }
    }

    async function searchGames(query) {
        if (!query.trim()) {
            // If query is empty, load all games
            loadGames();
            return;
        }

        try {
            // Show loading state
            gamesContainer.innerHTML = '<div class="loading">Searching...</div>';

            // Search games
            const results = await api.searchGames(query);

            // Clear container
            gamesContainer.innerHTML = '';

            // Display results
            if (results.length === 0) {
                gamesContainer.innerHTML = `<div class="no-results">No games found matching "${query}"</div>`;
            } else {
                // Update all games and display first page
                allGames = results;
                displayGames(results.slice(0, gamesPerPage));
                toggleLoadMoreButton();
            }

            // Scroll to games section
            document.getElementById('games').scrollIntoView({
                behavior: 'smooth'
            });
        } catch (error) {
            showNotification('Error searching games: ' + error.message, 'error');
        }
    }

    function loadMoreGames() {
        // Calculate next page
        const nextPage = currentPage + 1;
        const startIndex = currentPage * gamesPerPage;
        const endIndex = nextPage * gamesPerPage;

        // Get next batch of games
        const nextGames = allGames.slice(startIndex, endIndex);

        if (nextGames.length > 0) {
            // Update current page
            currentPage = nextPage;

            // Display games
            displayGames(nextGames);

            // Check if we need to hide the button
            toggleLoadMoreButton();
        }
    }

    function toggleLoadMoreButton() {
        const totalPages = Math.ceil(allGames.length / gamesPerPage);

        if (currentPage >= totalPages) {
            loadMoreBtn.style.display = 'none';
        } else {
            loadMoreBtn.style.display = 'block';
        }
    }

    function setupEventListeners() {
        // Genre filter change
        genreFilter.addEventListener('change', function () {
            const genreId = this.value;

            // Reset current page
            currentPage = 1;

            // Load games with selected genre
            loadGames({
                genreId,
                sort: sortOptions.value
            });
        });

        // Sort options change
        sortOptions.addEventListener('change', function () {
            // Reset current page
            currentPage = 1;

            // Reload games with current filter and new sort
            loadGames({
                genreId: genreFilter.value,
                sort: this.value
            });
        });

        // Load more button
        loadMoreBtn.addEventListener('click', loadMoreGames);

        // Search functionality
        searchBtn.addEventListener('click', function () {
            searchGames(searchInput.value);
        });

        searchInput.addEventListener('keypress', function (e) {
            if (e.key === 'Enter') {
                searchGames(this.value);
            }
        });

        // Browse games button
        browseGamesBtn.addEventListener('click', function () {
            document.getElementById('games').scrollIntoView({
                behavior: 'smooth'
            });
        });

        // Close modal
        closeModal.addEventListener('click', function () {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto'; // Re-enable scrolling
        });

        // Close modal when clicking outside
        window.addEventListener('click', function (e) {
            if (e.target === modal) {
                modal.style.display = 'none';
                document.body.style.overflow = 'auto';
            }
        });

        // Add to cart from modal
        document.querySelector('.add-to-cart-detail').addEventListener('click', function () {
            const gameId = parseInt(this.dataset.gameId);
            addToCart(gameId);
        });

        // Mobile menu toggle
        const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
        const navLinks = document.querySelector('.nav-links');

        mobileMenuBtn.addEventListener('click', function () {
            navLinks.classList.toggle('show');
        });

        // Smooth scrolling for anchor links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();

                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    window.scrollTo({
                        top: target.offsetTop - 70, // Offset for the sticky header
                        behavior: 'smooth'
                    });

                    // Update active nav link
                    document.querySelectorAll('.nav-links a').forEach(link => {
                        link.classList.remove('active');
                    });
                    this.classList.add('active');
                }
            });
        });
    }

    // Utility function for notifications
    function showNotification(message, type = 'success') {
        // Create notification element if it doesn't exist
        let notification = document.querySelector('.notification');

        if (!notification) {
            notification = document.createElement('div');
            notification.className = 'notification';
            document.body.appendChild(notification);

            // Add styles
            notification.style.position = 'fixed';
            notification.style.bottom = '20px';
            notification.style.right = '20px';
            notification.style.padding = '10px 20px';
            notification.style.borderRadius = 'var(--border-radius)';
            notification.style.boxShadow = 'var(--box-shadow)';
            notification.style.zIndex = '1001';
            notification.style.opacity = '0';
            notification.style.transform = 'translateY(20px)';
            notification.style.transition = 'all 0.3s ease';
        }

        // Set type-specific styles
        if (type === 'error') {
            notification.style.backgroundColor = '#ff3860';
        } else {
            notification.style.backgroundColor = 'var(--primary-color)';
        }
        notification.style.color = 'white';

        // Set message
        notification.textContent = message;

        // Show notification
        setTimeout(() => {
            notification.style.opacity = '1';
            notification.style.transform = 'translateY(0)';
        }, 10);

        // Hide notification
        setTimeout(() => {
            notification.style.opacity = '0';
            notification.style.transform = 'translateY(20px)';
        }, 3000);
    }

    // Function to set up blur control for hero section
    function setupBlurControl() {
        // Create the control element
        const controlContainer = document.createElement('div');
        controlContainer.className = 'blur-control';
        controlContainer.innerHTML = `
            <label for="blur-slider">Background Blur: <span id="blur-value">5px</span></label>
            <input type="range" id="blur-slider" min="0" max="20" value="5" step="1">
        `;

        // Add styles for the control
        const style = document.createElement('style');
        style.textContent = `
            .blur-control {
                position: fixed;
                bottom: 20px;
                left: 20px;
                background: rgba(0, 0, 0, 0.85);
                color: white;
                padding: 15px;
                border-radius: 8px;
                z-index: 1000;
                display: flex;
                flex-direction: column;
                width: 220px;
                box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
                border: 1px solid rgba(255, 255, 255, 0.1);
            }
            .blur-control label {
                margin-bottom: 8px;
                font-weight: bold;
                font-size: 14px;
            }
            .blur-control input {
                width: 100%;
                height: 6px;
                -webkit-appearance: none;
                appearance: none;
                background: rgba(255, 255, 255, 0.2);
                border-radius: 3px;
                outline: none;
            }
            .blur-control input::-webkit-slider-thumb {
                -webkit-appearance: none;
                appearance: none;
                width: 18px;
                height: 18px;
                border-radius: 50%;
                background: var(--accent-color);
                cursor: pointer;
            }
            .blur-control input::-moz-range-thumb {
                width: 18px;
                height: 18px;
                border-radius: 50%;
                background: var(--accent-color);
                cursor: pointer;
                border: none;
            }
        `;
        document.head.appendChild(style);

        // Append to body
        document.body.appendChild(controlContainer);

        // Set up event listener
        const blurSlider = document.getElementById('blur-slider');
        const blurValue = document.getElementById('blur-value');
        const heroSection = document.querySelector('.hero');

        blurSlider.addEventListener('input', function () {
            const value = this.value;
            blurValue.textContent = `${value}px`;

            // Update the blur
            document.documentElement.style.setProperty('--hero-blur', `${value}px`);

            // Add the CSS variable if it doesn't exist
            if (!heroSection.style.getPropertyValue('--hero-blur')) {
                const beforeElement = document.createElement('style');
                beforeElement.textContent = `
                    .hero::before {
                        backdrop-filter: blur(var(--hero-blur, 5px));
                        -webkit-backdrop-filter: blur(var(--hero-blur, 5px));
                    }
                `;
                document.head.appendChild(beforeElement);
            }
        });
    }
}); 