const mongoose = require('mongoose');
const plm = require('passport-local-mongoose');
const crypto = require("crypto");

const userSchema = new mongoose.Schema({
    profileImage: {
        type: String,
        default: "/images/default.png"
    },
    name: {
        type: String,
        required: [true, "Name is required!"],
        trim: true,
        minLength: [4, "Name must be atleast 4 charecter long"],
    },
    username: {
        type: String,
        trim: true,
        unique: true,
        lowercase: true,
        required: [true, "Username is required"],

    },
    email: {
        type: String,
        trim: true,
        lowercase: true,
        unique: true,
        required: [true, 'Email address is required'],
        match: [
            /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
            "Please enter a valid email address",
        ],
    },
    // password: {
    // type: String,
    // required: [true, "Password is required"],
    // validate: {
    //     validator: function(password) {
    //       // Password must contain at least one uppercase letter, one lowercase letter,
    //       // one number, and one special character
    //       const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    //       return passwordRegex.test(password);
    //     },
    //     message: 'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'
    //   }
    // },
    socketId: String,
resetPasswordToken: {
        type: Number,
        default: 0,
    },
}, { timestamps: true })


userSchema.plugin(plm, {
    passwordValidator: function (password, cb) {
        if (!password || password.length < 8) {
            return cb(new Error('Password must be at least 8 characters'));
        }

        // Check for uppercase, lowercase, number, and special char
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        if (!passwordRegex.test(password)) {
            return cb(new Error('Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'));
        }

        return cb(null);
    }
});
const User = mongoose.model('user', userSchema)
module.exports = User