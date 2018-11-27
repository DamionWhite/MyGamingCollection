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

module.exports = router;
