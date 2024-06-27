const io = require("socket.io")();
const socketapi = {
    io: io
};

const user = require('./models/userModel')
const Message = require('./models/messageModel')
// Add your socket.io logic here!
io.on("connection", function (socket) {
    console.log("A user connected");
    socket.on("join", async (username) => {
        await user.findOneAndUpdate({ username }, { socketId: socket.id })
    })

    // disconnect
    socket.on('disconnect', async () => {
        await user.findOneAndUpdate(
            {
                socketId: socket.id
            },
            { socketId: "" }
        )
    })

    // sender receiver text
    // sony
    socket.on("sony", async (messageObject) => {
        await Message.create({
            receiver: messageObject.receiver,
            sender: messageObject.sender,
            text: messageObject.text
        })
        const sender = await user.findOne({
            username: messageObject.sender
        })
        const receiver = await user.findOne({
            username: messageObject.receiver
        })
        const messagePacket = {
            sender: sender,
            receiver: receiver,
            text: messageObject.text
        }

        // max
        socket.to(receiver.socketId).emit("max", messagePacket)
    })
});

// end of socket.io logic

module.exports = socketapi;