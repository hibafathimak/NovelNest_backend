const messages = require('../models/messageModel');

exports.createMessageController = async (req, res) => {
  const { name, email, message } = req.body;

  try {
    const newMessage = new messages({ name, email, message });
    await newMessage.save();
    res.status(200).json('Message sent successfully');
  } catch (error) {
    console.error('Error saving message:', error); 
    res.status(500).json('Failed to send message');
  }
  
};

exports.getAllMessagesController = async (req, res) => {
  try {
    const allmessages = await messages.find();
    res.status(200).json(allmessages);
  } catch (error) {
    console.error(error);
    res.status(500).json('Failed to fetch messages');
  }
};

exports.getMessageByIdController = async (req, res) => {
  const { messageId } = req.params;

  try {
    const message = await messages.findById(messageId);

    if (!message) {
      return res.status(404).json('Message not found');
    }

    res.status(200).json({ success: true, message });
  } catch (error) {
    console.error(error);
    res.status(500).json('Failed to fetch the message');
  }
};

exports.deleteMessageController = async (req, res) => {
  const { messageId } = req.params;

  try {
    const deletedMessage = await messages.findByIdAndDelete(messageId);

    if (!deletedMessage) {
      return res.status(404).json('Message not found');
    }

    res.status(200).json('Message deleted successfully');
  } catch (error) {
    console.error(error);
    res.status(500).json('Failed to delete message');
  }
};
