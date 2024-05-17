import asyncHandler from 'express-async-handler'
import { generatetoken } from '../utilities/generate_token.js'
import bcrypt from 'bcryptjs'
import Product from '../models/Products.js'

export const get_by_category = asyncHandler(async (req, res, next) => {
	try {
		const { page, pageSize } = req.query;
		const { category, subCategory } = req.params;
		let query = {};
		if(subCategory !== "undefined"){
			query.category = { $all: [category, subCategory] }
		}else if(category !== "undefined"){
			query.category = { $in: [category] }
		}
		const products = await Product.find(query)
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