const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  bookId: {
    type: String, 
    required: true,
  },
  user: {
    type: String,
    required: true,
  },
  username:{
    type: String,
    required: true,
  },
  comment: {
    type: String,
    required: true,
    maxlength: 1000, 
  },
  rating: {
    type: Number,
    required: true,
    min: 1, 
    max: 5,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const reviews = mongoose.model('reviews', reviewSchema);

module.exports = reviews;
