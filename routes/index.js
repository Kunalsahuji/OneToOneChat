const express = require('express');
const router = express.Router();
const upload = require('../utils/multer')

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
router.get('/register', upload.single("profileImage"), userController.getRegisterUser);

// Register user route
router.post('/register-user', upload.single("profileImage"), userController.PostRegisterUser);

// Logout user route
router.get('/logout-user/:id', authController.isLoggedIn, userController.logoutUser);

// Forgot email route page
router.get('/forgot-email', userController.getForgotEmail);

// Forgot email route
router.post('/forgot-email', userController.PostForgotEmail);

// Forgot password route page
router.get('/forgot-password/:id', userController.getForgotPassword);
// Forgot password route
router.post('/forgot-password/:id', userController.PostForgotPassword);

// Get online users route
router.get('/getOnlineUser', authController.isLoggedIn, userController.getOnlineUsers);

// Get messages route
router.get('/getMessage', authController.isLoggedIn, chatController.getMessages);



module.exports = router;

