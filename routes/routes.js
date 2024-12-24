const usercontroller = require('../controllers/userController')
const productcontroller = require('../controllers/productController')
const ordercontroller = require('../controllers/orderController')
const paymentcontroller = require('../controllers/paymentContoller')
const reviewController =require('../controllers/reviewController')
const messageController =require('../controllers/messageController')

const upload = require('../middlewares/multer')
const jwtAuth = require('../middlewares/jwtMiddleware')
const express = require('express')
const isAdmin = require('../middlewares/IsAdminMiddleware')

const router = new express.Router()

//user routes
router.post('/register', usercontroller.registerController)
router.post('/login', usercontroller.loginController)

//product routes
router.post('/create-product', jwtAuth, isAdmin, upload.single('image'), productcontroller.createProductController)
router.delete('/product/:id/delete', jwtAuth, isAdmin, productcontroller.deleteProductController)
router.post('/product/:id/edit', jwtAuth, isAdmin, upload.single('image'), productcontroller.editProductController)
router.get('/all-products', productcontroller.getAllProductController)
router.get('/product/:id', productcontroller.getSingleProductController)

//order routes
router.post('/:userId/create-order', jwtAuth, ordercontroller.createOrderController)
router.get('/user/:userId/orders', jwtAuth, ordercontroller.userOrdersController)
router.put('/update-orders', jwtAuth, isAdmin, ordercontroller.updateStatusController)
router.get('/all-orders', jwtAuth, isAdmin, ordercontroller.allOrdersController)
router.get('/order/:orderId', jwtAuth, isAdmin, ordercontroller.singleOrderController)
router.put('/order/:orderId/cancel', jwtAuth, ordercontroller.cancelOrderController)


//cart routes
router.post('/cart-add', jwtAuth, usercontroller.addToCartController)
router.put('/cart-update', jwtAuth, usercontroller.updateCartController)
router.get('/:userId/cart', jwtAuth, usercontroller.getUserCartController)
router.put('/cart/:userId/update', jwtAuth, usercontroller.addCartToUserController)
router.delete('/cart/:userId/clear', jwtAuth, usercontroller.clearCartController)

//payment routes
router.post('/payment/order', jwtAuth, paymentcontroller.createOrderController)
router.post('/payment/verify', jwtAuth, paymentcontroller.verifyOrderController)

//review routes
router.post('/reviews',jwtAuth, reviewController.createReviewController);
router.get('/reviews/:bookId', reviewController.getReviewsByBookIdController);
router.put('/reviews/:reviewId',jwtAuth ,reviewController.updateReviewController);
router.delete('/reviews/:reviewId',jwtAuth, reviewController.deleteReviewController);

//message routes
router.post('/messages', messageController.createMessageController);
router.get('/messages', messageController.getAllMessagesController);
router.delete('/messages/:messageId', messageController.deleteMessageController);

//wishlist routes
router.post('/wishlist/:userId/add', jwtAuth, usercontroller.addToWishlistController);
router.delete('/wishlist/:itemId/delete', jwtAuth, usercontroller.deleteFromWishlistController);
router.get('/:userId/wishlist', jwtAuth, usercontroller.getUserWishlistController);
router.put('/wishlist/:userId/update', jwtAuth, usercontroller.addWishlistToUserController);

module.exports = router;
