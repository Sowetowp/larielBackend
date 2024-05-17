import express from 'express'
import * as AdminValidation from "../Validations/adminValidation.js"
import { get_by_category } from '../controllers/UserController.js'

const router = express.Router()


router.route('/getbycategory/:category?/:subCategory?')
    .get(get_by_category)

export default router