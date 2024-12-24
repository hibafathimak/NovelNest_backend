const mongoose = require('mongoose');

const Schema = new mongoose.Schema({
  userId: { type: String, required: true },
  userInfo: {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
  },
  items: { 
    type: Object, required: true 
  },
  amount: { type: Number, required: true },
  address: {
    street: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    zipcode: { type: String, required: true },
    country: { type: String, required: true },
  },
  status: { type: String, default: "Order Placed" },
  paymentMethod: { type: String, required: true },
  payment: { type: Boolean, default: false },
  date: { type: Date, required: true, default: Date.now },
});

const orders = mongoose.model("orders", Schema);

module.exports = orders;
