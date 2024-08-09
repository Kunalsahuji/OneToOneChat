const Message = require('../models/messageModel');

exports.getMessages = async (req, res) => {
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
}

exports.getUser = (req, res) => {
    res.render('index', { user: req.user })
}