import express from 'express'
import * as UserValidation from "../Validations/UserValidation.js"
import * as AddressValidation from "../Validations/AddressValidation.js"
import { billing_address_register, cart_register, create_order, get_billing_and_shipping, get_by_category, get_reviews, get_single_item, get_wishlist_and_cart, post_review, shipping_address_register, user_auth, user_register, wishlist_register } from '../controllers/UserController.js'

const router = express.Router()

router.route('/')
    .post(UserValidation.signup, user_register)
router.route('/billing')
    .post(AddressValidation.post, billing_address_register)
router.route('/order')
    .post(create_order)
router.route('/shipping')
    .post(AddressValidation.post, shipping_address_register)
router.route('/getbillingandshipping')
    .post(get_billing_and_shipping)
router.route('/getwishlistandcart')
    .post(get_wishlist_and_cart)
router.route('/postwishlist')
    .post(wishlist_register)
router.route('/postcart')
    .post(cart_register)
router.route('/login')
    .post(UserValidation.signin, user_auth)
router.route('/postreview')
    .post(post_review)
router.route('/getbycategory/:category?/:subCategory?')
    .get(get_by_category)
router.route('/getsingleproduct/:id')
    .get(get_single_item)
router.route('/getreviews/:id')
    .get(get_reviews)

export default router