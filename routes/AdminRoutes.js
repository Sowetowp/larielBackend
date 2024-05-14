import express from 'express'
import { admin_auth, admin_register } from '../controllers/AdminController.js'
import * as AdminValidation from "../Validations/adminValidation.js"
import { adminProtect } from '../middlewares/auth_handlers.js'

const router = express.Router()

router.route('/')
    .post(AdminValidation.signup, admin_register)
router.route('/login')
    .post(AdminValidation.signin, admin_auth)

export default router
