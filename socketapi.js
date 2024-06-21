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

});
// end of socket.io logic

module.exports = socketapi;