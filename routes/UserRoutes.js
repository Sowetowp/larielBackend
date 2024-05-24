import express from 'express'
import * as UserValidation from "../Validations/UserValidation.js"
import { billing_address_register, get_by_category, get_reviews, get_single_item, post_review, shipping_address_register, user_auth, user_register } from '../controllers/UserController.js'

const router = express.Router()

router.route('/')
    .post(UserValidation.signup, user_register)
router.route('/billing')
    .post(billing_address_register)
router.route('/shipping')
    .post(shipping_address_register)
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