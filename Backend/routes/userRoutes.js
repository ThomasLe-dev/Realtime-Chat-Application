const Route = require('express').Router();
const userController = require('../controller/userController')

Route.route('/').post(userController.register);
Route.post('/login', userController.login);

module.exports = Route;