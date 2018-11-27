const express = require('express');
const router = express.Router();

// Require controller
const ConsolesController = require('../controllers/consoles');

// Get all consoles
// 'GET' HOST_NAME/consoles
router.get('/', ConsolesController.get_all_consoles);

// Create a new console
// 'POST' HOST_NAME/consoles
router.post('/', ConsolesController.create_console);

// Get a single console by ID
// 'GET' HOST_NAME/consoles/:consoleId
router.get('/:consoleId', ConsolesController.get_console);

// Update a single console by ID
// 'PATCH' HOST_NAME/consoles/:consoleId
router.patch('/:consoleId', ConsolesController.update_console);

// Delete a single console by ID
// 'DELETE' HOST_NAME/consoles/:consoleId
router.delete('/:consoleId', ConsolesController.delete_console);

module.exports = router;
