const mongoose = require('mongoose');
const messageSchema = mongoose.Schema({
    receiver: String,
    sender: String,
    text: String
})
const Message = mongoose.model("message", messageSchema)
module.exports = Message