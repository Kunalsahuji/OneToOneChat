const User = require('../models/userModel');
const passport = require('passport')
const multer = require('multer');
const upload = require('../utils/multer')
const crypto = require("crypto");
const nodemailer = require("nodemailer");
const sendmail = require('../utils/nodemailer')

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
            res.redirect('/login');
        });
    } catch (error) {
        console.error("Registration error:", error);
        res.status(500).send(error.message);
    }
};
exports.getForgotEmail = (req, res) => {
    res.render('forgot-email', { user: req.user })
}
exports.PostForgotEmail = async (req, res) => {
    try {
        const user = await User.findOne({ email: req.body.forgotEmail });
        if (user) {
            const resetUrl = `${req.protocol}://${req.get("host")}/forgot-password/${user._id}`
            console.log("reset url : ", resetUrl)
            sendmail(user, resetUrl)
            res.send("Reset password link has been sent to your email.");
        }
        else {
            res.redirect("/forgot-email")
        }
    } catch (error) {
        console.error("Error in forgot password:", error);
        res.status(500).send(error.message);
    }
}

exports.getForgotPassword = (req, res) => {
    res.render('forgot-password', { user: req.user, id: req.params.id })
}
exports.PostForgotPassword = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (user.resetPasswordToken === 1) {
            await user.setPassword(req.body.newPassword);
            user.resetPasswordToken = 0;
            await user.save();
            res.redirect('/login')
        } else {
            res.send("Link Expired. Try Again!");
        }
    } catch (error) {
        console.log(error.message)
        res.send(error)
    }
}

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

