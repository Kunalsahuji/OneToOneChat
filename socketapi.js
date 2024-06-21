const io = require("socket.io")();
const socketapi = {
    io: io
};

const userModel = require('./models/userModel')

// Add your socket.io logic here!
io.on("connection", function (socket) {
    console.log("A user connected");
    socket.on("join", async (username) => {
        await userModel.findOneAndUpdate({ username }, { socketId: socket.id })
    })

    // disconnect
    socket.on('disconnect', async () => {
        await userModel.findOneAndUpdate(
            {
                socketId: socket.id
            },
            { socketId: "" }
        )
    })

    // sender receiver text
    socket.on("sony", async (messageObject) => {
        const sender = await userModel.findOne({
            username: messageObject.sender
        })
        const receiver = await userModel.findOne({
            username: messageObject.receiver
        })
        const messagePacket = {
            sender: sender,
            receiver: receiver,
            text: messageObject.text
        }
        socket.to(receiver.socketId).emit("max", messagePacket)
    })
});

// end of socket.io logic

module.exports = socketapi;