import express from 'express'
import { admin_auth, admin_register, admin_upload_product, approved_reviews, delete_single_product, pending_reviews, update_product, update_review } from '../controllers/AdminController.js'
import * as AdminValidation from "../Validations/adminValidation.js"
import { adminProtect } from '../middlewares/auth_handlers.js'

const router = express.Router()

router.route('/')
    .post(AdminValidation.signup, admin_register)
router.route('/login')
    .post(AdminValidation.signin, admin_auth)
router.route('/adminupload')
    .post(adminProtect, admin_upload_product)
router.route('/getpreviews')
    .get(adminProtect, pending_reviews)
router.route('/getareviews')
    .get(approved_reviews)
router.route('/deleteitem/:id')
    .delete(adminProtect, delete_single_product)
router.route('/updateitem/:id')
    .patch(adminProtect, update_product)
router.route('/updatereview/:id')
    .patch(adminProtect, update_review)
router.route('/getorder/:status')
    .get(adminProtect, update_review)

export default router