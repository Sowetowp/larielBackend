import asyncHandler from "express-async-handler";
import jwt from "jsonwebtoken";
import Admin from "../models/Admin.js";

export const adminProtect = asyncHandler(async (req, res, next) => {
	try {
		let token

		if (
			req.headers.authorization &&
			req.headers.authorization.startsWith('Bearer')
		) {
			try {
				token = req.headers.authorization.split(' ')[1]

				const decoded = jwt.verify(token, process.env.JWT_SECRET)

				req.admin = await Admin.findById(decoded.id).select('-password')

				next()
			} catch (error) {
				console.error(error)
				res.status(401)
				throw new Error('Not Authorized')
			}
		}

		if (!token) {
			res.status(401)
			throw new Error('Not Authorized')
		}
	} catch (error) {
		next(error)
	}
})