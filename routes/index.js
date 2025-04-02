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

// Forgot password route page
router.get('/forgot-password', authController.isLoggedIn, userController.getForgotPassword);
// Forgot password route
router.post('/forgot-password', authController.isLoggedIn, userController.PostForgotPassword);

// Reset password route page
router.get('/reset-password/:token', authController.isLoggedIn, userController.GetResetPassword);
// Reset password route
router.post('/reset-password/:token', authController.isLoggedIn, userController.PostResetPassword);
// Get online users route
router.get('/getOnlineUser', authController.isLoggedIn, userController.getOnlineUsers);

// Get messages route
router.get('/getMessage', authController.isLoggedIn, chatController.getMessages);



module.exports = router;

