const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    category: { type: String, required: true },
    author: { type: String, required: true },
    about: { type: String, required: true },
    price: { type: Number, required: true },
    popular: { type: Boolean, required: true },
    image: { type: String, required: true },
    date: { type: Date, required: true, default: Date.now },
    stock: { type: String, required: true } 
});

const books = mongoose.model('books', bookSchema);

module.exports = books;
