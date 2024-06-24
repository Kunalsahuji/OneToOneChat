const mongoose = require('mongoose');
mongoose.connect("mongodb+srv://whatsapp:kunal@kunalcluster.beakm07.mongodb.net/oneToOneChat?retryWrites=true&w=majority&appName=kunalcluster").then(() => {
    console.log("DB connected!")
}).catch((error) => {
    console.log(error.message)
})