const Review = require('../models/reviewModel');

exports.createReviewController = async (req, res) => {
    const { bookId, user,username, rating, comment } = req.body;

    try {
        const newReview = new Review({
            bookId,
            user,
            username,
            rating,
            comment,
        });

        await newReview.save();
        res.status(200).json('Review added successfully');
    } catch (error) {
        console.error(error);
        res.status(500).json('Failed to add review');
    }
};

exports.getReviewsByBookIdController = async (req, res) => {
    const { bookId } = req.params;

    try {
        const reviews = await Review.find({ bookId });

        if (reviews.length === 0) {
            return res.status(404).json('No reviews found for this book');
        }
        res.status(200).json(reviews);
    } catch (error) {
        console.error(error);
        res.status(500).json('Failed to fetch reviews');
    }
};

exports.updateReviewController = async (req, res) => {
    const { reviewId } = req.params;
    const { rating, comment } = req.body;

    try {
        const updatedReview = await Review.findByIdAndUpdate(
            reviewId,
            { rating, comment },{new:true}
        );

        if (!updatedReview) {
            return res.status(404).json('Review not found');
        }
        await updatedReview.save()

        res.status(200).json('Review updated successfully');
    } catch (error) {
        console.error(error);
        res.status(500).json('Failed to update review');
    }
};

exports.deleteReviewController = async (req, res) => {
    const { reviewId } = req.params;

    try {
        const deletedReview = await Review.findByIdAndDelete(reviewId);

        if (!deletedReview) {
            return res.status(404).json('Review not found');
        }

        res.status(200).json('Review deleted successfully');
    } catch (error) {
        console.error(error);
        res.status(500).json('Failed to delete review');
    }
};

