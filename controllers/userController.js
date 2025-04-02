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

            // If successful, redirect to login page
            res.redirect('/login');
        });
    } catch (error) {
        console.error("Registration error:", error);
        res.status(500).send(error.message);
    }
};
exports.getForgotPassword = (req, res) => {
    res.render('forgot-password', { user: req.user })
}
exports.PostForgotPassword = async (req, res) => {
    try {
        const user = await User.findOne({ email: req.body.email });
        if (!user) {
            return res.status(400).send("User not found");
        }
        const token = crypto.randomBytes(20).toString("hex");
        user.resetPasswordToken = token;
        user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
        await user.save();
        const resetUrl = `${req.protocol}://${req.get("host")}/forget-password/${user._id}`

        sendResetEmail(user, resetUrl)
        res.send("Reset password link has been sent to your email.");
    } catch (error) {
        console.error("Error in forgot password:", error);
        res.status(500).send(error.message);
    }
}
exports.GetResetPassword = async (req, res) => {
    try {
        const user = await User.findOne({
            resetPasswordToken: req.params.token,
            resetPasswordExpires: { $gt: Date.now() }
        });
        if (!user) {
            return res.status(400).send("Token expired or invalid");
        }
        res.render("reset-password", { token: req.params.token });
    } catch (error) {
        console.error("Error in reset password:", error);
        res.status(500).send(error.message);
    }
}
exports.PostResetPassword = async (req, res) => {
    try {
        const user = await User.findOne({
            resetPasswordToken: req.params.token,
            resetPasswordExpires: { $gt: Date.now() }
        });
        if (!user) {
            return res.status(400).send("Token expired or invalid");
        }
        // user.password = req.body.password;
        // user.resetPasswordToken = undefined;
        // user.resetPasswordExpires = undefined;
        user.setPassword(req.body.password, async (err) => {
            if (err) {
                return res.status(500).send("Error resetting password.");
            }
            user.resetPasswordToken = undefined;
            user.resetPasswordExpires = undefined;
            await user.save();
            res.redirect("/login");
        })
    } catch (error) {
        console.error("Error in reset password:", error);
        res.status(500).send(error.message);
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

