const { v2: cloudinary } = require('cloudinary');

const connectCloudinary = async () => {
    try {
        cloudinary.config({
            cloud_name: process.env.CLND_NAME,
            api_key: process.env.CLND_API_KEY,
            api_secret: process.env.CLND_API_SECRET,
        });
        console.log("Connected to Cloudinary");
    } catch (error) {
        console.error("Failed to connect to Cloudinary:", error.message);
    }
};

module.exports = connectCloudinary;
