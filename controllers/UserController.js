import asyncHandler from 'express-async-handler'
import { generatetoken } from '../utilities/generate_token.js'
import bcrypt from 'bcryptjs'
import Product from '../models/Products.js'
import Review from '../models/Review.js'

export const get_by_category = asyncHandler(async (req, res, next) => {
	try {
		const { page, pageSize } = req.query;
		const { category, subCategory } = req.params;
		let query = {};
		if (subCategory !== "undefined") {
			query.category = { $all: [category, subCategory] }
		} else if (category === "Sale") {
			query = { $expr: { $gt: ["$prevPrice", "$price"] } }
		} else if (category !== "undefined") {
			query.category = { $in: [category] }
		}
		const products = await Product.find(query)
			.sort({ createdAt: -1 })
			.skip((page - 1) * pageSize)
			.limit(pageSize);
		const totalProducts = await Product.countDocuments();
		const totalPages = Math.ceil(totalProducts / pageSize);
		res.status(200).json({
			status: "ok",
			message: "All products retrieved",
			data: {
				products,
				totalProducts,
				currentPage: Number(page),
				totalPages,
			}
		})
	} catch (error) {
		next(error)
	}
})

export const get_single_item = asyncHandler(async (req, res, next) => {
	try {
		const product = await Product.findById(req.params.id)
		if (product) {
			res.status(200).json({
				status: "ok",
				message: "All products retrieved",
				data: product
			})
		} else {
			res.status(404).json({ message: 'Product not found' });
		}
	} catch (error) {
		next(error)
	}
})

export const post_review = asyncHandler(async (req, res, next) => {
	try {
		const {
			rating,
			product,
			review,
			email,
			name
		} = req.body

		const myReview = await Review.create({
			rating,
			product,
			review,
			email,
			name
		})

		if (myReview) {
			res.status(201).json({
				message: 'Review Posted successfully',
				status: 'ok',
				data: myReview
			})
		} else {
			res.status(400)
			throw new Error('Invalid data provided.')
		}
	} catch (error) {
		next(error);
	}
})

export const get_reviews = asyncHandler(async (req, res, next) => {
	try {
		const myReviews = await Review.find({ product: req.params.id, approved: true }).sort({ createdAt: -1 })
		if (myReviews) {
			res.status(200).json({
				message: 'Reviews fetched successfully',
				status: 'ok',
				data: myReviews
			})
		} else {
			res.status(400)
			throw new Error('Invalid data provided.')
		}
	} catch (error) {
		next(error);
	}
})