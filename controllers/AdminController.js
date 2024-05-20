import asyncHandler from 'express-async-handler'
import { generatetoken } from '../utilities/generate_token.js'
import bcrypt from 'bcryptjs'
import { deleteImagesFromCloudinary, uploadImagesToCloudinary } from '../config/cloudinary.js'
import Admin from '../models/Admin.js'
import Product from '../models/Products.js'

export const admin_register = asyncHandler(async (req, res, next) => {
	try {
		const {
			firstName,
			lastName,
			email,
			password,
		} = req.body

		const registered = await Admin.find({ email })
		if (registered.length > 0) {
			throw new Error('Oops! try logging in')
		}

		const adminExists = await Admin.find({})
		if (adminExists.length > 0) {
			throw new Error('Sorry, there can only be one admin')
		}

		const hashedPass = await bcrypt.hash(password, 10)

		const admin = await Admin.create({
			firstName,
			lastName,
			email,
			password: hashedPass,
		})

		if (admin) {
			res.status(201).json({
				message: 'Admin registered successfully',
				status: 'ok',
				data: {
					id: admin._id,
					firstName: admin.firstName,
					lastName: admin.lastName,
					email: admin.email,
					password: admin.password,
					token: generatetoken(admin._id)
				}
			})
		} else {
			res.status(400)
			throw new Error('Invalid data provided.')
		}
	} catch (error) {
		next(error);
	}
})

export const admin_auth = asyncHandler(async (req, res, next) => {
	try {
		const {
			email,
			password,
		} = req.body

		const admin = await Admin.findOne({ email })

		if (!admin) {
			throw new Error('Not the admin')
		}
		if (!bcrypt.compareSync(password, admin.password)) {
			throw new Error('Incorrect password')
		}

		res.status(201).json({
			message: 'Welcome Admin',
			status: 'ok',
			data: {
				id: admin._id,
				firstName: admin.firstName,
				lastName: admin.lastName,
				email: admin.email,
				password: admin.password,
				token: generatetoken(admin._id)
			}
		})
	} catch (error) {
		next(error);
	}
})

export const admin_upload_product = asyncHandler(async (req, res, next) => {
	try {
		const {
			name,
			code,
			category,
			imageColor,
			price,
			quantity,
			description,
			sizes,
			images,
			colors,
		} = req.body

		const uploadedImage = await uploadImagesToCloudinary(images);

		const identity = uploadedImage.map((e) => ({ id: e.public_id, url: e.url }))

		const product = await Product.create({
			name,
			code,
			category,
			imageColor,
			price,
			quantity,
			description,
			sizes,
			images: identity,
			colors,
		})

		if (product) {
			res.status(201).json({
				message: 'Product uploaded successfully',
				status: 'ok',
				data: product
			})
		} else {
			res.status(400)
			throw new Error('Invalid data provided.')
		}
	} catch (error) {
		next(error);
	}
})

export const delete_single_product = asyncHandler(async (req, res, next) => {
	try {
		const productDetail = await Product.findById(req.params.id)
		if (productDetail) {
			const deletedImages = await deleteImagesFromCloudinary(productDetail.images)
			const product = await Product.findByIdAndDelete(req.params.id)
			if (product) {
				res.status(200).json({
					status: "ok",
					message: "Product deleted successfully",
				})
			} else {
				throw new Error("Something went wrong.")
			}
		} else {
			throw new Error("Not found")
		}
	} catch (error) {
		next(error)
	}
})

export const update_product = asyncHandler(async (req, res, next) => {
	try {
		const product = await Product.findById(req.params.id)
		if (!product) {
			res.status(404).json({ message: 'Product not found' });
			return;
		}
		const {
			name,
			code,
			category,
			imageColor,
			price,
			quantity,
			description,
			sizes,
			images,
			colors,
			images2,
			imagesToDelete
		} = req.body
		const uploadedImage = await uploadImagesToCloudinary(images);
		const deletedImages = await deleteImagesFromCloudinary(imagesToDelete)
		const identity = uploadedImage.map((e) => ({ id: e.public_id, url: e.url }))
		const newimages = [images2, identity].flat()
		if (product) {
			product.name = name || product.name
			product.code = code || product.code,
			product.category = category || product.category,
			product.imageColor = imageColor || product.imageColor,
			product.price = price || product.price,
			product.quantity = quantity || product.quantity,
			product.description = description || product.description,
			product.sizes = sizes || product.sizes,
			product.images = newimages || product.images,
			product.colors = colors || product.colors,
			product.prevPrice = product.price

			const updated = await product.save()
			if (updated) {
				res.status(201).json({
					message: 'Product successfully updated!!',
					status: 'ok',
					data: updated
				})
			}
		} else {
			res.status(401)
			throw new Error('Something went wrong.')
		}
	} catch (error) {
		next(error);
	}
})