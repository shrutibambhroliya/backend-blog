const mongoose = require('mongoose');

mongoose.set("strictQuery", false);

const fileSchema = new mongoose.Schema({
    PhotoPath: {
        type: String,
        required: true
    },
    Title: {
        type: String,
        required: true
    },
    Description: {
        type: String,
        required: true
    },
    DropDown: {
        type: String,
        required: true
    }

});
module.exports = mongoose.model("images", fileSchema)
