const mongoose = require('mongoose');
mongoose.connect(process.env.CONNECTION_STRING).then(() => {
    console.log("DB connected!")
}).catch((error) => {
    console.log(error.message)
})