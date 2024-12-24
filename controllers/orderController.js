const orders = require('../models/orderModel')

exports.createOrderController = async (req, res) => {
    console.log("Inside createOrderController");
  
    const { userId } = req.params;
    const { userInfo, items, amount, address, paymentMethod,payment } = req.body;
    const date = Date.now();

  
    try {
      const newOrder = new orders({
        userId,
        userInfo, 
        items,
        amount,
        address,
        paymentMethod,
        payment,
        date,
      });
  
      await newOrder.save();
      return res.status(200).json(newOrder._id);
    } catch (error) {
      console.error("Error creating order:", error);
      return res.status(500).json("An error occurred while placing the order.");
    }
  };
exports.allOrdersController = async (req, res) => {
    try {
        const allOrders = await orders.find();
        if (!allOrders) {
            return res.status(404).json("No orders found");
        }
        res.status(200).json(allOrders );
    } catch (error) {
        res.status(401).json("Server Error");
    }
};

exports.singleOrderController = async (req, res) => {
  const { orderId } = req.params;

  try {
    const singleOrder = await orders.findById(orderId);
    if (!singleOrder) {
      return res.status(404).json("No order found");
    }
    res.status(200).json(singleOrder);
  } catch (error) {
    console.error(error);
    res.status(500).json("Server Error");
  }
};

exports.cancelOrderController =async (req, res) => {
  const { orderId } = req.params;

  try {
    const order = await orders.findById(orderId);

    if (!order) {
      return res.status(404).json('Order not found.');
    }

    if (order.status === 'Cancelled') {
      return res.status(400).json('Order is already canceled.');
    }

    order.status = 'Cancelled';
    await order.save();

    res.status(200).json('Order successfully canceled.');
  } catch (error) {
    console.error('Error canceling order:', error.message);
    res.status(500).json('An error occurred while canceling the order.');
  }
}

exports.updateStatusController = async (req, res) => {
    const { id, status } = req.body;

  if(status!=='Cancelled'){  try {
        const order = await orders.findById(id);
        if (!order) {
            return res.status(404).json("Order not found");
        }

        order.status = status;
        await order.save();

        res.status(200).json("Order status updated successfully");
    } catch (error) {
        console.error("Error updating order status:", error);
        res.status(401).json({ success: false, message: "Server Error", error: error.message });
    }}
};

exports.userOrdersController = async (req, res) => {
    const { userId } = req.params;
    try {
        const userOrders = await orders.find({ userId }); 

        if (!userOrders || userOrders.length === 0) {
            return res.status(404).json("No orders found for this user");
        }
        res.status(200).json(userOrders);
    } catch (error) {
        console.error("Error fetching user orders:", error);
        res.status(500).json("Server Error");
    }
};


  
