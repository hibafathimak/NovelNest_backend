const users = require('../models/userModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

exports.registerController = async (req, res) => {
    const { username, email, password } = req.body;
    try {
        const existingUser = await users.findOne({ email });
        if (existingUser) {
            return res.status(406).json("User already exists");
        }

        const encryptedPassword = await bcrypt.hash(password, 10);

        const newUser = new users({ username, email, password: encryptedPassword, role: 'user' });
        await newUser.save();

        res.status(200).json({ userId: newUser._id, role: newUser.role });
    } catch (error) {
        console.error(error);
        res.status(401).json("Registration failed. Please try again.");
    }
};

exports.loginController = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await users.findOne({ email });
        if (!user) {
            return res.status(404).json("User not found"); 
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(404).json("Invalid email or password"); 
        }

        const token = jwt.sign({ userId: user._id, role: user.role }, process.env.JWTPASSWORD);

        res.status(200).json({ token, user });
    } catch (error) {
        res.status(401).json("An error occurred during login"); 
    }
};



exports.addToCartController = async (req, res) => {
  console.log("Inside addToCartController");
  const { userId, itemId } = req.body;

  if (!itemId || itemId === 0) {
      return res.status(400).json("Invalid item ID. Cannot add to cart.");
  }

  try {
      const userData = await users.findById(userId);
      if (!userData) {
          return res.status(404).json("User not found");
      }

      const userCart = userData.cartData || {};
      if (userCart[itemId]) {
          userCart[itemId] += 1;
      } else {
          userCart[itemId] = 1;
      }

      await users.findByIdAndUpdate(userId, { cartData: userCart }, { new: true });
      res.status(200).json("Added to Cart");
  } catch (error) {
      console.error("Error adding to cart:", error);
      res.status(500).json("An error occurred while adding to the cart");
  }
};

exports.updateCartController = async (req, res) => {
  console.log("Inside updateCartController");
  const { userId, itemId, quantity } = req.body;

  if (!itemId || itemId === 0) {
    return res.status(400).json("Invalid item ID. Cannot update cart.");
  }

  try {
    const userData = await users.findById(userId);
    if (!userData) {
      return res.status(404).json("User not found");
    }

    const userCart = userData.cartData || {};

    if (quantity === 0) {
      delete userCart[itemId];
    } else {
      userCart[itemId] = quantity;
    }

    await users.findByIdAndUpdate(userId, { cartData: userCart }, { new: true });
    res.status(200).json("Cart updated successfully");
  } catch (error) {
    console.error("Error updating cart:", error);
    res.status(500).json("Failed to update cart");
  }
};

exports.addCartToUserController = async (req, res) => {
    const { userId } = req.params;
    const { cartData } = req.body;
    console.log(req.body);
    
  
    if (!userId || !cartData) {
      return res.status(400).json("Invalid userId or cart data.");
    }
    
  
    try {
      const user = await users.findById(userId);
      if (!user) {
        return res.status(404).json("User not found.");
      }
  
      const userCart = user.cartData || {};
  
      Object.keys(cartData).forEach(itemId => {
        if (userCart[itemId]) {
          userCart[itemId] += cartData[itemId];  
        } else {
          userCart[itemId] = cartData[itemId];  
        }
      });
  
      const updatedUser = await users.findByIdAndUpdate(userId, { cartData: userCart }, { new: true });
      res.status(200).json("Your cart has been updated.");
    } catch (error) {
      console.error("Error updating cart:", error.message);
      res.status(500).json("An error occurred while updating the cart.");
    }
};

exports.clearCartController = async (req, res) => {
  const { userId } = req.params;

  if (!userId) {
    return res.status(400).json("Invalid userId.");
  }

  try {
    const user = await users.findById(userId);
    if (!user) {
      return res.status(404).json("User not found.");
    }

    user.cartData = {};
    await user.save();

    res.status(200).json("Cart cleared successfully.");
  } catch (error) {
    console.error("Error clearing cart:", error.message);
    res.status(500).json("An error occurred while clearing the cart.");
  }
};


exports.getUserCartController =async (req,res) => {
    console.log("Inside addToCartController");
    const {userId}=req.params
    try {
    const userData = await users.findById(userId)
    const userCart = userData.cartData
    console.log(userCart);
    
    res.status(200).json(userCart)
    
    } catch (error) {
        res.status(401).json(error)
    }
}


exports.addToWishlistController = async (req, res) => {
  const { userId } = req.params;
  const { itemId } = req.body;

  if (!userId || !itemId) {
    return res.status(400).json("Invalid userId or itemId.");
  }

  try {
    const user = await users.findById(userId);
    if (!user) {
      return res.status(404).json("User not found.");
    }

    const userWishlist = user.wishlist || [];
    const itemIndex = userWishlist.findIndex((item) => item === itemId);

    if (itemIndex === -1) {
      userWishlist.push(itemId);
      await users.findByIdAndUpdate(userId, { wishlist: userWishlist }, { new: true });
      return res.status(200).json("Wishlist updated successfully.");
    }

    return res.status(400).json("Item already in wishlist.");
  } catch (error) {
    console.error("Error updating wishlist:", error.message);
    res.status(500).json("An error occurred while updating the wishlist.");
  }
};



exports.deleteFromWishlistController = async (req, res) => {
  const { itemId } = req.params;
  const { userId } = req.body;

  if (!userId || !itemId) {
    return res.status(400).json("Invalid userId or itemId.");
  }

  try {
    const user = await users.findById(userId);
    if (!user) {
      return res.status(404).json("User not found.");
    }

    const userWishlist = user.wishlist || [];
    const updatedWishlist = userWishlist.filter((item) => item !== itemId);

    if (updatedWishlist.length === userWishlist.length) {
      return res.status(404).json("Item not found in wishlist.");
    }

    await users.findByIdAndUpdate(userId, { wishlist: updatedWishlist }, { new: true });
    res.status(200).json("Item removed from wishlist.");
  } catch (error) {
    console.error("Error deleting item from wishlist:", error.message);
    res.status(500).json("An error occurred while deleting the item from wishlist.");
  }
};


exports.getUserWishlistController = async (req, res) => {
  console.log("getUserWishlistController");
  const { userId } = req.params;

  try {
    const user = await users.findById(userId);
    if (!user) {
      return res.status(404).json("User not found.");
    }

    const userWishlist = user.wishlist || [];
    res.status(200).json(userWishlist);
  } catch (error) {
    console.error("Error fetching wishlist:", error.message);
    res.status(500).json("An error occurred while fetching the wishlist.");
  }
};

exports.addWishlistToUserController = async (req, res) => {
  console.log("addWishlistToUserController");

  const { userId } = req.params;
  const { wishlistData } = req.body;

  if (!userId || !wishlistData || wishlistData.length === 0) {
    return res.status(400).json("Invalid userId or empty wishlist data.");
  }

  try {
    const user = await users.findById(userId);
    if (!user) {
      return res.status(404).json("User not found.");
    }

    let userWishlist = user.wishlist || [];

    wishlistData.forEach((newItemId) => {
      if (!userWishlist.includes(newItemId)) {
        userWishlist.push(newItemId); 
      }
    });

    const updatedUser = await users.findByIdAndUpdate(userId, { wishlist: userWishlist }, { new: true });
    console.log("Updated User:", updatedUser);
    res.status(200).json("Your wishlist has been updated.");
  } catch (error) {
    console.error("Error updating wishlist:", error.message);
    res.status(500).json("An error occurred while updating the wishlist.");
  }
}




