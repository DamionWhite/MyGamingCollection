const express = require('express');
const router = express.Router();

const usersController = require('../controllers/users');

// Get all users
// 'GET' HOST_NAME/users
router.get('/', usersController.get_all_users);

// Create a new User
// 'POST' HOST_NAME/users/signup
router.post('/signup', usersController.create_user);

// Login a user
// 'POST' HOST_NAME/users/login
router.post('/login', usersController.login_user);

// Get a single user by ID
// 'GET' HOST_NAME/users/:userId
router.get('/:userId', usersController.get_user);

// Delete a single user by ID
// 'DELETE' HOST_NAME/users/:userId
router.delete('/:userId', usersController.delete_user);

//// GAMES ////

// Get all the users games
// 'GET' HOST_NAME/users/:userId/games
router.get('/:userId/games', usersController.get_all_games);

// Add a game to user
// If it doesn't exist in the database, add it
// 'POST' HOST_NAME/users/:userId/games
router.post('/:userId/games', usersController.add_game);

// Delete a game from a user's list
// 'DELETE' HOST_NAME/users/:userId/games/:gameId
router.delete('/:userId/games/:gameId', usersController.delete_game);

module.exports = router;
