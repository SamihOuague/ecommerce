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
    comment: String,
    rate: {
        type: Number,
        required: true,
    },
    product_id: {
        type: String,
        required: true,
    }
});

module.exports = mongoose.model("review", Schema);