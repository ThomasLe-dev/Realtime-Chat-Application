const Route = require('express').Router();
const protect = require('../middleware/authMiddleware');
const chatController = require('../controller/chatController');

Route.post('/', protect, chatController.accessChat);
Route.get('/', protect, chatController.fetchChats);
Route.post('/group', protect, chatController.createGroupChat);
Route.put('/rename', protect, chatController.renameGroupChat);
Route.put('/add', protect, chatController.addUsertoGroupChat);
Route.put('/removeFromGroup', protect, chatController.removeFromGroup);



module.exports = Route;