const mongoose = require('mongoose');

const crudSchema = new mongoose.Schema({

    Username: {
        type: String,
        required: true
    },
    Email: {
        type: String,
        required: true
    },
    Password: {
        type: Number,
        required: false
    }
});
module.exports = mongoose.model("others", crudSchema)