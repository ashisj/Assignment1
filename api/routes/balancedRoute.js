const express = require('express');
const router = express.Router();

const BalancedControllers = require('../controllers/balancedController');
const InputValidator = require('../services/inputValidator');

router.use(InputValidator.validate('parenthesis'));

router.post('/',BalancedControllers.balanced);
module.exports = router;