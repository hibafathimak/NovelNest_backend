const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    username: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    cartData: { type: Object },
    wishlist:{type:Array},
    role: { type: String, default: "user" },
}, { minimize: false });

const users = mongoose.model('users', userSchema);

module.exports =users