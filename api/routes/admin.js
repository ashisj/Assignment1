const express = require('express');
const router = express.Router();

const adminController = require('../controllers/adminController');

router.get('/',adminController.getAllRegisteredUser);

router.delete('/username/:username',adminController.deleteUser);

module.exports = router;