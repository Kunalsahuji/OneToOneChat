const express = require('express');
const router = express.Router();

const authController = require('../controllers/authController')
const chatController = require('../controllers/chatController')
const userController = require('../controllers/userController')

// Routes

// Home page route
router.get('/', authController.isLoggedIn, chatController.getUser);

// Login page route
router.get('/login', userController.getLoginUser);

// Login user route
router.post('/login-user',
  userController.PostLoginUser
);

// Register page route
router.get('/register', userController.getRegisterUser);

// Register user route
router.post('/register-user', userController.PostRegisterUser);

// Logout user route
router.get('/logout-user/:id', authController.isLoggedIn, userController.logoutUser);

// Get online users route
router.get('/getOnlineUser', authController.isLoggedIn, userController.getOnlineUsers);

// Get messages route
router.get('/getMessage', authController.isLoggedIn, chatController.getMessages);

module.exports = router;

