const mongoose =require('mongoose')

const PaymentSchema = new mongoose.Schema({
    userId:{
        type: String,
        required: true,
    },
    orderId:{
        type: String,
        required: true,
    },
    razorpay_order_id: {
        type: String,
        required: true,
    },
    razorpay_payment_id: {
        type: String,
        required: true,
    },
    razorpay_signature: {
        type: String,
        required: true,
    },
    date: {
        type: Date,
        default: Date.now
    },
});
const payments=mongoose.model('payment', PaymentSchema);

module.exports = payments