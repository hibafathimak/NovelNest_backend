const Razorpay = require('razorpay');
const crypto = require('crypto');
const payments = require('../models/paymentModel')

const razorpayInstance = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
});

exports.createOrderController=async(req, res) => {
    const { amount } = req.body;

    try {
        const options = {
            amount: Math.round(Number(amount) * 100),
            currency: "USD",
            receipt: crypto.randomBytes(10).toString("hex"),
        }

        razorpayInstance.orders.create(options, (error, order) => {
            if (error) {
                console.log(error);
                return res.status(500).json({ message: "Something Went Wrong!" });
            }
            res.status(200).json(order);
            console.log(order)
        });
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error!" });
        console.log(error);
    }
}

// Backend controller function to verify payment
exports.verifyOrderController = async (req, res) => {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, orderId, userId } = req.body;
  
    console.log("Received verification request:", req.body);
  
    try {
      if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature || !orderId || !userId) {
        return res.status(400).json({ message: "Missing required fields" });
      }
  
      const sign = razorpay_order_id + "|" + razorpay_payment_id;
      console.log("String to be signed:", sign);
  
      const expectedSign = crypto.createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
        .update(sign)
        .digest("hex");
      console.log("Expected signature:", expectedSign);
  
      const isAuthentic = expectedSign === razorpay_signature;
      console.log("Signature match status:", isAuthentic);
  
      if (isAuthentic) {
        const payment = new payments({
          userId,
          orderId,
          razorpay_order_id,
          razorpay_payment_id,
          razorpay_signature
        });
  
        await payment.save();
        console.log('Payment saved successfully:', payment);
  
        res.json({
          message: "Payment Successful"
        });
      } else {
        console.log("Invalid Signature");
        return res.status(400).json({ message: "Invalid Signature" });
      }
    } catch (error) {
      console.error("Error during payment verification:", error);
      return res.status(500).json({ message: "Internal Server Error!" });
    }
  };
