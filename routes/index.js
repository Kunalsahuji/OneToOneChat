var express = require('express');
var router = express.Router();

const User = require('../models/userModel')
const passport = require('passport');
const LocalStrategy = require('passport-local');
passport.use(new LocalStrategy(User.authenticate()))

/* GET home page. */
router.get('/', isLoggedIn, function (req, res, next) {
  res.render('index', { user: req.user });
});

router.get('/login', function (req, res, next) {
  res.render('login', { user: req.user });
});
router.post('/login-user',
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/login"
  }),
  function (req, res, next) {
  });


router.get('/register', function (req, res, next) {
  res.render('register', { user: req.user });
});

router.post('/register-user', async function (req, res, next) {
  try {
    const { name, username, email, password } = req.body;
    const { profileImage } = req.body.profileImage
    await User.register(
      { profileImage, name, username, email }, password
    )
    res.redirect('/login',);
  } catch (error) {
    console.log(error)
    res.send(error.message)
  }
});

router.get('/logout-user/:id', isLoggedIn, function (req, res, next) {
  req.logout(() => {
    res.redirect('/login')
  })
});

router.get('/getOnlineUser', isLoggedIn, async (req, res, next) => {
  const loggedInUser = req.user
  const onlineUsers = await User.find({
    socketId: { $ne: "" },
    _id: { $ne: loggedInUser._id }
  })
  res.status(200).json({ onlineUsers })
})

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    next();
  }
  else {
    res.redirect('/login')
  }
}


module.exports = router;
