import express from 'express'
import * as AdminValidation from "../Validations/adminValidation.js"
import { get_by_category, get_single_item } from '../controllers/UserController.js'

const router = express.Router()


router.route('/getbycategory/:category?/:subCategory?')
    .get(get_by_category)
router.route('/getsingleproduct/:id')
    .get(get_single_item)

export default router