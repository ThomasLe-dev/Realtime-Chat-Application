const Route = require('express').Router();
const userController = require('../controller/userController')
const protect = require('../middleware/authMiddleware');

Route.post('/', userController.register);
Route.post('/login', userController.login);
Route.get('/', protect, userController.searchUsers);

module.exports = Route;