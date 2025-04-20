/**
 * This file contains API functions to connect with the backend.
 * It replaces the mock API with real API calls.
 */

// API Base URL
const API_BASE_URL = '';  // Empty string means relative to current origin

// API endpoints
const ENDPOINTS = {
    GAMES: '/games',
    GENRES: '/genres'
};

// API functions
const api = {
    // Get all games
    getGames: async function (filters = {}) {
        try {
            const response = await fetch(ENDPOINTS.GAMES);
            if (!response.ok) {
                throw new Error(`Failed to fetch games: ${response.status}`);
            }

            let games = await response.json();

            // Apply client-side filtering based on genre if specified
            if (filters.genreId) {
                games = games.filter(game =>
                    game.genreID === parseInt(filters.genreId)
                );
            }

            // Apply client-side sorting if specified
            if (filters.sort) {
                switch (filters.sort) {
                    case 'name':
                        games.sort((a, b) => a.name.localeCompare(b.name));
                        break;
                    case 'price-low':
                        games.sort((a, b) => a.price - b.price);
                        break;
                    case 'price-high':
                        games.sort((a, b) => b.price - a.price);
                        break;
                    case 'release':
                        games.sort((a, b) => new Date(b.releaseDate) - new Date(a.releaseDate));
                        break;
                }
            }

            // Map the data to match our frontend expectations
            return games.map(game => ({
                id: game.id,
                name: game.name,
                genreID: game.genreID || 0,
                genreName: game.genre,
                price: game.price,
                releaseDate: game.releaseDate
            }));

        } catch (error) {
            console.error('Error fetching games:', error);
            throw error;
        }
    },

    // Get game by ID
    getGame: async function (id) {
        try {
            const response = await fetch(`${ENDPOINTS.GAMES}/${id}`);
            if (!response.ok) {
                if (response.status === 404) {
                    throw new Error('Game not found');
                }
                throw new Error(`Failed to fetch game: ${response.status}`);
            }

            const game = await response.json();

            // Map to expected format
            return {
                id: game.id,
                name: game.name,
                genreID: game.genreID,
                genreName: '', // Will need to be fetched separately or joined on client
                price: game.price,
                releaseDate: game.releaseDate
            };

        } catch (error) {
            console.error(`Error fetching game ${id}:`, error);
            throw error;
        }
    },

    // Get all genres
    getGenres: async function () {
        try {
            const response = await fetch(ENDPOINTS.GENRES);
            if (!response.ok) {
                throw new Error(`Failed to fetch genres: ${response.status}`);
            }

            const genres = await response.json();

            // Get game counts (this would ideally be from the API)
            const games = await this.getGames();

            // Map and count games per genre
            return genres.map(genre => {
                const gameCount = games.filter(game =>
                    game.genreID === genre.id ||
                    game.genreName === genre.name
                ).length;

                return {
                    id: genre.id,
                    name: genre.name,
                    gameCount: gameCount
                };
            });

        } catch (error) {
            console.error('Error fetching genres:', error);
            throw error;
        }
    },

    // Get games by genre - leverages the getGames method with filtering
    getGamesByGenre: async function (genreId) {
        return await this.getGames({ genreId });
    },

    // Search games - client-side implementation
    searchGames: async function (query) {
        try {
            // Get all games first
            const allGames = await this.getGames();

            // Case-insensitive search
            const q = query.toLowerCase();
            return allGames.filter(game =>
                game.name.toLowerCase().includes(q) ||
                (game.genreName && game.genreName.toLowerCase().includes(q))
            );

        } catch (error) {
            console.error('Error searching games:', error);
            throw error;
        }
    },

    // Create a new game
    createGame: async function (gameData) {
        try {
            const response = await fetch(ENDPOINTS.GAMES, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    name: gameData.name,
                    genreID: gameData.genreID,
                    price: parseFloat(gameData.price),
                    releaseDate: gameData.releaseDate,
                    photoUrl: gameData.photoUrl
                })
            });

            if (!response.ok) {
                throw new Error(`Failed to create game: ${response.status}`);
            }

            return await response.json();

        } catch (error) {
            console.error('Error creating game:', error);
            throw error;
        }
    },

    // Update an existing game
    updateGame: async function (id, gameData) {
        try {
            const response = await fetch(`${ENDPOINTS.GAMES}/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    name: gameData.name,
                    genreID: gameData.genreID,
                    price: parseFloat(gameData.price),
                    releaseDate: gameData.releaseDate,
                    photoUrl: gameData.photoUrl
                })
            });

            if (!response.ok) {
                throw new Error(`Failed to update game: ${response.status}`);
            }

            return true; // The API returns no content on success

        } catch (error) {
            console.error(`Error updating game ${id}:`, error);
            throw error;
        }
    },

    // Delete a game
    deleteGame: async function (id) {
        try {
            const response = await fetch(`${ENDPOINTS.GAMES}/${id}`, {
                method: 'DELETE'
            });

            if (!response.ok) {
                throw new Error(`Failed to delete game: ${response.status}`);
            }

            return true; // The API returns no content on success

        } catch (error) {
            console.error(`Error deleting game ${id}:`, error);
            throw error;
        }
    },

    // Add to cart (simulated - would connect to a real cart API in production)
    addToCart: function (gameId) {
        return new Promise((resolve) => {
            setTimeout(() => {
                console.log(`Added game ${gameId} to cart (simulated)`);
                resolve({ success: true, message: 'Game added to cart' });
            }, 200);
        });
    }
};

// Export the API object
window.gameStoreApi = api; 