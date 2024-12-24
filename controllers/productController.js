const books = require('../models/productModel');
const { v2: cloudinary } = require('cloudinary');

exports.createProductController = async (req, res) => {
    console.log("inside createProductController");

    const { name, description, category, author, about, price, popular, stock } = req.body;
    let imageUrl = "https://via.placeholder.com/150";

    try {
        if (req.file) {
            console.log("Upload File", req.file);
            const result = await cloudinary.uploader.upload(req.file.path, { resource_type: "auto" });
            imageUrl = result.secure_url;
        }

        const productData = {
            name,
            description,
            category,
            author,
            about,
            price: Number(price),
            popular: popular === "true" ? true : false,
            stock: stock || "in stock", 
            image: imageUrl,
            date: Date.now()
        };

        const product = new books(productData);
        await product.save();

        res.status(200).json("Product Created");

    } catch (error) {
        console.error( error);
        res.status(401).json("Server error");
    }
};

exports.editProductController = async (req, res) => {
    const {id} =req.params
    const { name, description, category, author, about, price, popular, stock } = req.body;

    try {
        const product = await books.findById(id);

        if (!product) {
            return res.status(404).json("Product not found");
        }

        product.name = name || product.name;
        product.description = description || product.description;
        product.category = category || product.category;
        product.author = author || product.author;
        product.about = about || product.about;
        product.price = price ? Number(price) : product.price;
        product.popular = popular !== undefined ? popular === "true" : product.popular;
        product.stock = stock || product.stock; 

        if (req.file) {
            const result = await cloudinary.uploader.upload(req.file.path, { resource_type: "auto" });
            product.image = result.secure_url;
        }

        await product.save();
        res.status(200).json("Product updated successfully");

    } catch (error) {
        console.error( error);
        res.status(401).json("Error updating product ..Server error");
    }
};

exports.deleteProductController = async (req, res) => {
    const {id} =req.params
    try {
        const product = await books.findByIdAndDelete(id);
        if (!product) {
            return res.status(404).json("Product not found" );
        }
        res.status(200).json("Product deleted successfully");
    } catch (error) {
        console.error(error);
        res.status(401).json("Server error");
    }
};


exports.getAllProductController = async (req, res) => {
    try {
        const products = await books.find();
        res.status(200).json(products);
    } catch (error) {
        console.error( error);
        res.status(401).json("Server error" );
    }
};

exports.getSingleProductController = async (req, res) => {
    const {id} =req.params
    try {
        const product = await books.findById(id);
        if (!product) {
            return res.status(404).json("Product not found");
        }
        res.status(200).json(product);
    } catch (error) {
        console.error(error);
        res.status(401).json("Server error");
    }
};
