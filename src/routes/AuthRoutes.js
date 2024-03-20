const express = require('express');
const AuthController = require('../controllers/AuthController');

const Router = express.Router();


Router.post('/signup' , AuthController.signUp);
Router.post('/login', AuthController.login);

module.exports = Router;