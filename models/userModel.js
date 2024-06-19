const mongoose = require('mongoose');
const plm = require('passport-local-mongoose');
const userSchema = new mongoose.Schema({
    profilePic: {
        type: String,
        default: "default.png"
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
    },
    password: String,

}, { timestamps: true })


userSchema.plugin(plm)
const User = mongoose.model('user', userSchema)
module.exports = User