import express from 'express'
import * as AdminValidation from "../Validations/adminValidation.js"
import { get_by_category, get_reviews, get_single_item, post_review } from '../controllers/UserController.js'

const router = express.Router()

router.route('/postreview')
    .post(post_review)
router.route('/getbycategory/:category?/:subCategory?')
    .get(get_by_category)
router.route('/getsingleproduct/:id')
    .get(get_single_item)
router.route('/getreviews/:id')
    .get(get_reviews)

export default router