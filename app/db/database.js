const mongoose = require('mongoose');
const { parsed } = require('dotenv').config()
mongoose.set('strictQuery', false);
mongoose.connect(parsed.MONGODB)
    .then(() => {
        console.log("database connected...");
    }).catch((eer) => {
        console.log(err);
    })
