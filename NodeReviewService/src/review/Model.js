const mongoose = require("mongoose");

const Schema = new mongoose.Schema({
    username: String,
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

const UserSchema = new mongoose.Schema({
    firstname: String,
    lastname: String,
}, { collection: "members" });

module.exports = {
    Model: mongoose.model("review", Schema),
    UserModel: mongoose.model("user", UserSchema),
}