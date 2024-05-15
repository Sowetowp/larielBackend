import express from 'express'
import { admin_auth, admin_register, admin_upload_product } from '../controllers/AdminController.js'
import * as AdminValidation from "../Validations/adminValidation.js"
import { adminProtect } from '../middlewares/auth_handlers.js'

const router = express.Router()

router.route('/')
    .post(AdminValidation.signup, admin_register)
router.route('/login')
    .post(AdminValidation.signin, admin_auth)
router.route('/adminupload')
    .post(adminProtect, admin_upload_product)

export default router
