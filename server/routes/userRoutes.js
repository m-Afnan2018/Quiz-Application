const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { protect } = require('../Middleware/userMiddleware'); // Ensure this is the correct 




router.post('/signup', userController.signup);
router.post('/login', userController.login);

module.exports = router;
