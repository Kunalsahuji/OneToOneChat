const io = require("socket.io")();
const socketapi = {
    io: io
};

const User = require('./models/userModel');
const Message = require('./models/messageModel');

// Add your socket.io logic here!
io.on("connection", (socket) => {
    console.log("A user connected");

    // Join event: Update user's socket ID
    socket.on("join", async (username) => {
        try {
            await User.findOneAndUpdate({ username }, { socketId: socket.id });
        } catch (error) {
            console.error("Error updating user socket ID:", error);
        }
    });

    // Disconnect event: Clear user's socket ID
    socket.on('disconnect', async () => {
        try {
            await User.findOneAndUpdate({ socketId: socket.id }, { socketId: "" });
        } catch (error) {
            console.error("Error clearing user socket ID:", error);
        }
    });

    // Handle incoming messages
    socket.on("sony", async (messageObject) => {
        try {
            // Save the message in the database
            const newMessage = await Message.create({
                receiver: messageObject.receiver,
                sender: messageObject.sender,
                text: messageObject.text
            });

            // Find sender and receiver user objects
            const sender = await User.findOne({ username: messageObject.sender });
            const receiver = await User.findOne({ username: messageObject.receiver });

            // Prepare message packet
            const messagePacket = {
                sender: sender,
                receiver: receiver,
                text: messageObject.text
            };

            // Emit message to the receiver
            socket.to(receiver.socketId).emit("max", messagePacket);
        } catch (error) {
            console.error("Error handling message:", error);
        }
    });
});

// End of socket.io logic
module.exports = socketapi;
