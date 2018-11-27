const express = require('express');
const router = express.Router();

// Require controller
const GamesController = require('../controllers/games');

// Get all games
// 'GET' HOST_NAME/games
router.get('/', GamesController.get_all_games);

// Create a new game
// 'POST' HOST_NAME/games
router.post('/', GamesController.create_game);

// Get a single game by ID
// 'GET' HOST_NAME/games/:gameId
router.get('/:gameId', GamesController.get_game);

// Update a single game by ID
// 'PATCH' HOST_NAME/games/:gameId
router.patch('/:gameId', GamesController.update_game);

// Delete a single game by ID
// 'DELETE' HOST_NAME/games/:gameId
router.delete('/:gameId', GamesController.delete_game);

module.exports = router;
