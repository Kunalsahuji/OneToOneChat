// var express = require('express');
// var router = express.Router();

// const User = require('../models/userModel')
// const Message = require('../models/messageModel')

// const passport = require('passport');
// const LocalStrategy = require('passport-local');
// passport.use(new LocalStrategy(User.authenticate()))

// /* GET home page. */
// router.get('/', isLoggedIn, function (req, res, next) {
//   res.render('index', { user: req.user });
// });

// router.get('/login', function (req, res, next) {
//   res.render('login', { user: req.user });
// });
// router.post('/login-user',
//   passport.authenticate("local", {
//     successRedirect: "/",
//     failureRedirect: "/login"
//   }),
//   function (req, res, next) {
//   });


// router.get('/register', function (req, res, next) {
//   res.render('register', { user: req.user });
// });

// router.post('/register-user', async function (req, res, next) {
//   try {
//     const { name, username, email, password } = req.body;
//     const { profileImage } = req.body.profileImage
//     User.register(
//       { profileImage, name, username, email }, password
//     )
//     res.redirect('/login',);
//   } catch (error) {
//     console.log(error)
//     res.send(error.message)
//   }
// });

// router.get('/logout-user/:id', isLoggedIn, function (req, res, next) {
//   req.logout(() => {
//     res.redirect('/login')
//   })
// });

// router.get('/getOnlineUser', isLoggedIn, async (req, res, next) => {
//   const loggedInUser = req.user
//   const onlineUsers = await User.find({
//     socketId: { $ne: "" },
//     _id: { $ne: loggedInUser._id }
//   })
//   res.status(200).json({ onlineUsers })
// })

// // getMessage
// router.get('/getMessage', isLoggedIn, async (req, res, next) => {
//   const sender = req.user.username
//   const receiver = req.query.receiver
//   const messages = await Message.find({
//     $or: [{
//       sender: sender,
//       receiver: receiver
//     }, {
//       sender: receiver,
//       receiver: sender
//     }]
//   })
//   res.status(200).json({ messages })
// })

// function isLoggedIn(req, res, next) {
//   if (req.isAuthenticated()) {
//     next();
//   }
//   else {
//     res.redirect('/login')
//   }
// }


// module.exports = router;

const express = require('express');
const router = express.Router();
const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('../models/userModel');
const Message = require('../models/messageModel');

// Initialize passport local strategy
passport.use(new LocalStrategy(User.authenticate()));

// Middleware to check if the user is authenticated
function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/login');
}

// Routes

// Home page route
router.get('/', isLoggedIn, (req, res) => {
  res.render('index', { user: req.user });
});

// Login page route
router.get('/login', (req, res) => {
  res.render('login', { user: req.user });
});

// Login user route
router.post('/login-user',
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/login"
  })
);

// Register page route
router.get('/register', (req, res) => {
  res.render('register', { user: req.user });
});

// Register user route
router.post('/register-user', async (req, res) => {
  try {
    const { name, username, email, password } = req.body;
    const { profileImage } = req.body;

    await User.register({ profileImage, name, username, email }, password);
    res.redirect('/login');
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).send(error.message);
  }
});

// Logout user route
router.get('/logout-user/:id', isLoggedIn, (req, res) => {
  req.logout(() => {
    res.redirect('/login');
  });
});

// Get online users route
router.get('/getOnlineUser', isLoggedIn, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const onlineUsers = await User.find({
      socketId: { $ne: "" },
      _id: { $ne: loggedInUser._id }
    });
    res.status(200).json({ onlineUsers });
  } catch (error) {
    console.error("Error fetching online users:", error);
    res.status(500).send(error.message);
  }
});

// Get messages route
router.get('/getMessage', isLoggedIn, async (req, res) => {
  try {
    const sender = req.user.username;
    const receiver = req.query.receiver;

    const messages = await Message.find({
      $or: [
        { sender: sender, receiver: receiver },
        { sender: receiver, receiver: sender }
      ]
    });

    res.status(200).json({ messages });
  } catch (error) {
    console.error("Error fetching messages:", error);
    res.status(500).send(error.message);
  }
});

module.exports = router;

