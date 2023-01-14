const mongoose = require("mongoose");

const Schema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    subject: String,
    message: {
        type: String,
        required: true,
    }
});

module.exports = mongoose.model("contact", Schema);