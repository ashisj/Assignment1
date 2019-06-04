const express = require('express');
const router = express.Router();
const AuthControllers = require('../controllers/authControllers');
const InputValidator = require('../services/inputValidator');

router.post('/login',InputValidator.validate('login'),AuthControllers.login);

router.post('/register',InputValidator.validate('register'),AuthControllers.register);

module.exports = router;