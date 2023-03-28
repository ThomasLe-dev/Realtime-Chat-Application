const Route = require('express').Router();
const protect = require('../middleware/authMiddleware');
const chatController = require('../controller/chatController');

Route.post('/', protect, chatController.accessChat);
Route.get('/', protect, chatController.fetchChats);
Route.post('/group', protect, chatController.createGroupChat);



module.exports = Route;