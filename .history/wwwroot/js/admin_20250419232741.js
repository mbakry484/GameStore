document.addEventListener('DOMContentLoaded', function () {
    // Get API reference
    const api = window.gameStoreApi;

    // DOM Elements
    const gamesTableBody = document.getElementById('games-table-body');
    const addGameBtn = document.getElementById('add-game-btn');
    const gameFormModal = document.getElementById('game-form-modal');
    const modalTitle = document.getElementById('modal-title');
    const gameForm = document.getElementById('game-form');
    const gameIdInput = document.getElementById('game-id');
    const gameNameInput = document.getElementById('game-name');
    const gameGenreSelect = document.getElementById('game-genre');
    const gamePriceInput = document.getElementById('game-price');
    const gameReleaseDateInput = document.getElementById('game-release-date');
    const gamePhotoUrlInput = document.getElementById('game-photo-url');
    const gamePhotoFileInput = document.getElementById('game-photo-file');
    const fileNameDisplay = document.getElementById('file-name');
    const previewImage = document.getElementById('preview-image');
    const cancelBtn = document.getElementById('cancel-btn');
    const saveBtn = document.getElementById('save-btn');
    const closeModalBtn = document.querySelector('#game-form-modal .close-modal');

    // Confirmation modal elements
    const confirmModal = document.getElementById('confirm-modal');
    const cancelDeleteBtn = document.getElementById('cancel-delete-btn');
    const confirmDeleteBtn = document.getElementById('confirm-delete-btn');

    // State
    let genresMap = {};
    let gameToDelete = null;
    let selectedFile = null;

    // Initialize
    init();

    // Functions
    async function init() {
        try {
            // Load genres
            await loadGenres();

            // Load games
            await loadGames();

            // Set up event listeners
            setupEventListeners();
        } catch (error) {
            showNotification(`Error initializing: ${error.message}`, 'error');
        }
    }

    async function loadGenres() {
        try {
            const genres = await api.getGenres();

            // Clear select (keep the first option)
            while (gameGenreSelect.options.length > 1) {
                gameGenreSelect.remove(1);
            }

            // Add genres to select and build map for reference
            genres.forEach(genre => {
                const option = document.createElement('option');
                option.value = genre.id;
                option.textContent = genre.name;
                gameGenreSelect.appendChild(option);

                // Add to map for easy lookup
                genresMap[genre.id] = genre.name;
            });
        } catch (error) {
            showNotification(`Error loading genres: ${error.message}`, 'error');
        }
    }

    async function loadGames() {
        try {
            // Show loading
            gamesTableBody.innerHTML = `
                <tr class="loading-row">
                    <td colspan="6">Loading games...</td>
                </tr>
            `;

            // Get games
            const games = await api.getGames();

            // Clear table
            gamesTableBody.innerHTML = '';

            // Handle empty state
            if (games.length === 0) {
                gamesTableBody.innerHTML = `
                    <tr class="empty-row">
                        <td colspan="6">No games found. Add a new game to get started.</td>
                    </tr>
                `;
                return;
            }

            // Add games to table
            games.forEach(game => {
                // Format values
                const formattedPrice = `$${game.price.toFixed(2)}`;
                const releaseDate = new Date(game.releaseDate);
                const formattedDate = releaseDate.toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric'
                });

                // Get photo thumbnail if available
                const photoCell = game.photoUrl
                    ? `<img src="${game.photoUrl}" alt="${game.name}" class="game-thumbnail" />`
                    : '<span class="no-image">No image</span>';

                // Create row
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${game.id}</td>
                    <td>
                        <div class="game-name-cell">
                            ${photoCell}
                            <span>${game.name}</span>
                        </div>
                    </td>
                    <td>${game.genreName || genresMap[game.genreID] || 'Unknown'}</td>
                    <td>${formattedPrice}</td>
                    <td>${formattedDate}</td>
                    <td>
                        <div class="action-buttons">
                            <button class="btn-edit" data-id="${game.id}">
                                <i class="fas fa-edit"></i> Edit
                            </button>
                            <button class="btn-delete" data-id="${game.id}">
                                <i class="fas fa-trash"></i> Delete
                            </button>
                        </div>
                    </td>
                `;

                // Add to table
                gamesTableBody.appendChild(row);

                // Add event listeners to buttons
                const editBtn = row.querySelector('.btn-edit');
                const deleteBtn = row.querySelector('.btn-delete');

                editBtn.addEventListener('click', () => openEditForm(game));
                deleteBtn.addEventListener('click', () => openDeleteConfirmation(game));
            });
        } catch (error) {
            showNotification(`Error loading games: ${error.message}`, 'error');
            gamesTableBody.innerHTML = `
                <tr class="error-row">
                    <td colspan="6">Error loading games: ${error.message}</td>
                </tr>
            `;
        }
    }

    function setupEventListeners() {
        // Add Game button
        addGameBtn.addEventListener('click', openNewGameForm);

        // Form submission
        gameForm.addEventListener('submit', handleFormSubmit);

        // Cancel button
        cancelBtn.addEventListener('click', closeModal);

        // Close modal X button
        closeModalBtn.addEventListener('click', closeModal);

        // Confirmation modal buttons
        cancelDeleteBtn.addEventListener('click', closeConfirmModal);
        confirmDeleteBtn.addEventListener('click', handleDeleteGame);

        // File input change
        gamePhotoFileInput.addEventListener('change', handleFileSelection);

        // Photo URL input change - clear file selection if URL is entered
        gamePhotoUrlInput.addEventListener('input', function () {
            if (this.value && selectedFile) {
                // Clear file selection if URL is entered
                gamePhotoFileInput.value = '';
                fileNameDisplay.textContent = 'No file chosen';
                selectedFile = null;

                // Hide preview from file
                previewImage.style.display = 'none';

                // Show preview from URL if valid
                if (isValidImageUrl(this.value)) {
                    previewImage.src = this.value;
                    previewImage.alt = 'Image preview';
                    previewImage.style.display = 'block';
                }
            }
        });
    }

    function handleFileSelection(event) {
        const file = event.target.files[0];

        // Clear selection if no file chosen
        if (!file) {
            fileNameDisplay.textContent = 'No file chosen';
            previewImage.style.display = 'none';
            selectedFile = null;
            return;
        }

        // Validate file type
        const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
        if (!validTypes.includes(file.type)) {
            showNotification('Please select a valid image file (JPG, PNG, WebP)', 'error');
            gamePhotoFileInput.value = '';
            fileNameDisplay.textContent = 'No file chosen';
            return;
        }

        // Validate file size (max 2MB)
        if (file.size > 2 * 1024 * 1024) {
            showNotification('Image size should not exceed 2MB', 'error');
            gamePhotoFileInput.value = '';
            fileNameDisplay.textContent = 'No file chosen';
            return;
        }

        // Display file name and store selected file
        fileNameDisplay.textContent = file.name;
        selectedFile = file;

        // Clear URL input
        gamePhotoUrlInput.value = '';

        // Show image preview
        const reader = new FileReader();
        reader.onload = function (e) {
            previewImage.src = e.target.result;
            previewImage.alt = file.name;
            previewImage.style.display = 'block';
        };
        reader.readAsDataURL(file);
    }

    function isValidImageUrl(url) {
        // Simple validation for image URLs
        return url && /\.(jpg|jpeg|png|webp|gif)$/i.test(url);
    }

    function openNewGameForm() {
        // Set modal title
        modalTitle.textContent = 'Add New Game';

        // Clear form fields
        gameIdInput.value = '';
        gameForm.reset();

        // Clear file selection
        selectedFile = null;
        fileNameDisplay.textContent = 'No file chosen';
        previewImage.style.display = 'none';

        // Set today's date as default
        const today = new Date().toISOString().split('T')[0];
        gameReleaseDateInput.value = today;

        // Open modal
        gameFormModal.style.display = 'block';
        document.body.style.overflow = 'hidden'; // Prevent scrolling

        // Focus on name input
        gameNameInput.focus();
    }

    function openEditForm(game) {
        // Set modal title
        modalTitle.textContent = 'Edit Game';

        // Set form values
        gameIdInput.value = game.id;
        gameNameInput.value = game.name;
        gameGenreSelect.value = game.genreID;
        gamePriceInput.value = game.price;
        gamePhotoUrlInput.value = game.photoUrl || '';

        // Clear file selection
        selectedFile = null;
        gamePhotoFileInput.value = '';
        fileNameDisplay.textContent = 'No file chosen';

        // Show image preview if photo URL exists
        if (game.photoUrl) {
            previewImage.src = game.photoUrl;
            previewImage.alt = game.name;
            previewImage.style.display = 'block';
        } else {
            previewImage.style.display = 'none';
        }

        // Format date for input (YYYY-MM-DD)
        const releaseDate = new Date(game.releaseDate);
        const year = releaseDate.getFullYear();
        const month = String(releaseDate.getMonth() + 1).padStart(2, '0');
        const day = String(releaseDate.getDate()).padStart(2, '0');
        gameReleaseDateInput.value = `${year}-${month}-${day}`;

        // Open modal
        gameFormModal.style.display = 'block';
        document.body.style.overflow = 'hidden'; // Prevent scrolling

        // Focus on name input
        gameNameInput.focus();
    }

    function closeModal() {
        gameFormModal.style.display = 'none';
        document.body.style.overflow = 'auto'; // Re-enable scrolling
    }

    function openDeleteConfirmation(game) {
        // Store reference to game being deleted
        gameToDelete = game;

        // Open confirmation modal
        confirmModal.style.display = 'block';
        document.body.style.overflow = 'hidden'; // Prevent scrolling
    }

    function closeConfirmModal() {
        confirmModal.style.display = 'none';
        document.body.style.overflow = 'auto'; // Re-enable scrolling
        gameToDelete = null;
    }

    async function handleFormSubmit(event) {
        event.preventDefault();

        try {
            let photoUrl = gamePhotoUrlInput.value.trim() || null;

            // Handle file upload if a file is selected
            if (selectedFile) {
                try {
                    photoUrl = await uploadImage(selectedFile);
                } catch (error) {
                    showNotification(`Error uploading image: ${error.message}`, 'error');
                    return;
                }
            }

            // Get form data
            const formData = {
                name: gameNameInput.value.trim(),
                genreID: parseInt(gameGenreSelect.value),
                price: parseFloat(gamePriceInput.value),
                releaseDate: gameReleaseDateInput.value,
                photoUrl: photoUrl
            };

            // Validate data
            if (!formData.name) {
                throw new Error('Game name is required');
            }

            if (!formData.genreID) {
                throw new Error('Please select a genre');
            }

            if (isNaN(formData.price) || formData.price < 0) {
                throw new Error('Price must be a positive number');
            }

            if (!formData.releaseDate) {
                throw new Error('Release date is required');
            }

            // Check if we're creating or updating
            const gameId = gameIdInput.value;
            let result;

            if (gameId) {
                // Update existing game
                result = await api.updateGame(gameId, formData);
                showNotification('Game updated successfully');
            } else {
                // Create new game
                result = await api.createGame(formData);
                showNotification('Game created successfully');
            }

            // Close modal and reload games
            closeModal();
            await loadGames();

        } catch (error) {
            showNotification(`Error saving game: ${error.message}`, 'error');
        }
    }

    async function uploadImage(file) {
        try {
            // Create FormData object to send file to server
            const formData = new FormData();
            formData.append('file', file);

            // Send file to server
            const response = await fetch('/api/upload/image', {
                method: 'POST',
                body: formData
            });

            if (!response.ok) {
                // Try to get error as JSON first, but fall back to text if it's not valid JSON
                let errorMessage;
                const contentType = response.headers.get('content-type');
                if (contentType && contentType.includes('application/json')) {
                    const errorData = await response.json();
                    errorMessage = errorData || 'Failed to upload image';
                } else {
                    errorMessage = await response.text();
                }
                throw new Error(errorMessage);
            }

            // Get the path from the response
            const data = await response.json();
            return data.path;
        } catch (error) {
            console.error('Error uploading image:', error);
            throw new Error(`Failed to upload image: ${error.message}`);
        }
    }

    async function handleDeleteGame() {
        if (!gameToDelete) return;

        try {
            // Delete the game
            await api.deleteGame(gameToDelete.id);

            // Close modal and reload games
            closeConfirmModal();
            await loadGames();

            showNotification('Game deleted successfully');
        } catch (error) {
            showNotification(`Error deleting game: ${error.message}`, 'error');
        }
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
}); 