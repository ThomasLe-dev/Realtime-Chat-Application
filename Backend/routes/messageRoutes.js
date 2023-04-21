const protect = require('../middleware/authMiddleware');
const messageController = require('../controller/messageController');
const Route = require('express').Router();

Route.post('/', protect, messageController.sendMessage);
Route.get('/:chatId', protect, messageController.allMessages);

module.exports = Route;