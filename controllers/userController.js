const User = require('../models/userModel');
const passport = require('passport')
const multer = require('multer');
const upload = require('../utils/multer')


//Initialize passport local strategy
const LocalStrategy = require('passport-local');
passport.use(new LocalStrategy(User.authenticate()));

exports.getLoginUser = (req, res) => {
    res.render('login', { user: req.user })
}

exports.PostLoginUser = passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/login"
})

exports.logoutUser = (req, res) => {
    req.logout(() => {
        res.redirect("/login")
    })
}

exports.getRegisterUser = (req, res) => {
    res.render('register', { user: req.user })
}

exports.PostRegisterUser = async (req, res) => {
    try {
        const { name, username, email, password } = req.body;

        const profileImage = req.file ? `/images/${req.file.filename}` : "/images/default.png";

        const newUser = new User({
            name,
            username,
            email,
            profileImage  
        });

        User.register(newUser, password, (err, user) => {
            if (err) {
                console.error("Error registering user:", err);
                return res.status(500).send(err.message);
            }

            // If successful, redirect to login page
            res.redirect('/login');
        });
    } catch (error) {
        console.error("Registration error:", error);
        res.status(500).send(error.message);
    }
};


exports.getOnlineUsers = async (req, res) => {
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
}

