import asyncHandler from 'express-async-handler'
import { generatetoken } from '../utilities/generate_token.js'
import bcrypt from 'bcryptjs'
import { deleteImagesFromCloudinary, uploadImagesToCloudinary } from '../config/cloudinary.js'
import Admin from '../models/Admin.js'
import Product from '../models/Products.js'
import Review from '../models/Review.js'

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
			imagesToDelete,
			prevPrice
		} = req.body
		const uploadedImage = await uploadImagesToCloudinary(images);
		const deletedImages = await deleteImagesFromCloudinary(imagesToDelete)
		const identity = uploadedImage.map((e) => ({ id: e.public_id, url: e.url }))
		const newimages = [images2, identity].flat()

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
			product.prevPrice = prevPrice || product.prevPrice

		const updated = await product.save()
		if (updated) {
			res.status(201).json({
				message: 'Product successfully updated!!',
				status: 'ok',
				data: updated
			})
		}
	} catch (error) {
		next(error);
	}
})

export const approved_reviews = asyncHandler(async (req, res, next) => {
	try {
		const { page, pageSize } = req.query;
		const reviews = await Review.find({ approved: true })
			.sort({ createdAt: -1 })
			.populate("product", "name")
			.skip((page - 1) * pageSize)
			.limit(pageSize);
		const totalReviews = await Review.countDocuments({ approved: true });
		const totalPages = Math.ceil(totalReviews / pageSize);
		res.status(200).json({
			status: "ok",
			message: "Reviews retrieved",
			data: {
				reviews,
				totalReviews,
				currentPage: Number(page),
				totalPages,
			}
		})
	} catch (error) {
		next(error)
	}
})

export const pending_reviews = asyncHandler(async (req, res, next) => {
	try {
		const { page, pageSize } = req.query;
		const reviews = await Review.find({ approved: false })
			.sort({ createdAt: -1 })
			.populate("product", "name")
			.skip((page - 1) * pageSize)
			.limit(pageSize);
		const totalReviews = await Review.countDocuments({ approved: false });
		const totalPages = Math.ceil(totalReviews / pageSize);
		res.status(200).json({
			status: "ok",
			message: "Reviews retrieved",
			data: {
				reviews,
				totalReviews,
				currentPage: Number(page),
				totalPages,
			}
		})
	} catch (error) {
		next(error)
	}
})

export const update_review = asyncHandler(async (req, res, next) => {
	try {
		const review = await Review.findById(req.params.id)
		if (!review) {
			res.status(404).json({ message: 'Review not found' });
			return;
		}
		const { approved = review.approved } = req.body;
		review.approved = approved;
		const updated = await review.save()
		if (updated) {
			res.status(201).json({
				message: 'Success!!',
				status: 'ok',
				data: updated
			})
		}
	} catch (error) {
		next(error);
	}
})