import asyncHandler from 'express-async-handler'
import { generatetoken } from '../utilities/generate_token.js'
import bcrypt from 'bcryptjs'
import Product from '../models/Products.js'
import Review from '../models/Review.js'
import User from '../models/User.js'
import BillingAddress from '../models/BillingAddress.js'
import ShippingAddress from '../models/ShippingAddress.js'
import Cart from '../models/Cart.js'
import Wishlist from '../models/WishList.js'
import Order from '../models/Order.js'

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

export const user_register = asyncHandler(async (req, res, next) => {
	try {
		const {
			email,
			password,
		} = req.body

		const userExists = await User.find({ email })
		if (userExists.length > 0) {
			throw new Error('User exists already')
		}

		const hashedPass = await bcrypt.hash(password, 10)
		const username = email.split("@")
		const user = await User.create({
			email,
			password: hashedPass,
			displayName: username[0]
		})

		if (user) {
			res.status(201).json({
				message: 'User registered successfully',
				status: 'ok',
				data: {
					id: user._id,
					firstName: user.firstName,
					lastName: user.lastName,
					email: user.email,
					displayName: user.displayName,
					password: user.password,
					token: generatetoken(user._id)
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

export const user_auth = asyncHandler(async (req, res, next) => {
	try {
		const {
			email,
			password,
		} = req.body

		const user = await User.findOne({ email })

		if (!user) {
			throw new Error('User not found')
		}
		if (!bcrypt.compareSync(password, user.password)) {
			throw new Error('Incorrect password')
		}
		const wish = await Wishlist.findOne({ user: user._id })
		const car = await Cart.findOne({ user: user._id })
		res.status(201).json({
			message: `Welcome ${user.displayName}`,
			status: 'ok',
			data: {
				id: user._id,
				firstName: user.firstName,
				lastName: user.lastName,
				email: user.email,
				displayName: user.displayName,
				password: user.password,
				token: generatetoken(user._id)
			},
			wishlist: wish.wishlist,
			cart: car.cart
		})
	} catch (error) {
		next(error);
	}
})

export const billing_address_register = asyncHandler(async (req, res, next) => {
	try {
		const {
			firstName,
			lastName,
			companyName,
			country,
			address,
			appartment,
			town,
			state,
			phoneNumber,
			email,
			user
		} = req.body

		const billing = await BillingAddress.findOne({ user })
		if (billing) {
			billing.firstName = firstName || billing.firstName,
				billing.lastName = lastName || billing.lastName,
				billing.companyName = companyName || billing.companyName,
				billing.country = country || billing.country,
				billing.address = address || billing.address,
				billing.appartment = appartment || billing.appartment,
				billing.town = town || billing.town,
				billing.state = state || billing.state,
				billing.phoneNumber = phoneNumber || billing.phoneNumber,
				billing.email = email || billing.email
			const updated = await billing.save()
			if (updated) {
				res.status(201).json({
					message: 'Address updated successfully',
					status: 'ok',
					data: updated
				})
			}
		} else {
			const newBilling = await BillingAddress.create({
				firstName,
				lastName,
				companyName,
				country,
				address,
				appartment,
				town,
				state,
				phoneNumber,
				email,
				user
			})
			if (newBilling) {
				res.status(201).json({
					message: 'Address registered successfully',
					status: 'ok',
					data: newBilling
				})
			}
		}
	} catch (error) {
		next(error);
	}
})

export const shipping_address_register = asyncHandler(async (req, res, next) => {
	try {
		const {
			firstName,
			lastName,
			companyName,
			country,
			address,
			appartment,
			town,
			state,
			phoneNumber,
			email,
			user
		} = req.body

		const shipping = await ShippingAddress.findOne({ user })
		if (shipping) {
			shipping.firstName = firstName || shipping.firstName,
				shipping.lastName = lastName || shipping.lastName,
				shipping.companyName = companyName || shipping.companyName,
				shipping.country = country || shipping.country,
				shipping.address = address || shipping.address,
				shipping.appartment = appartment || shipping.appartment,
				shipping.town = town || shipping.town,
				shipping.state = state || shipping.state,
				shipping.phoneNumber = phoneNumber || shipping.phoneNumber,
				shipping.email = email || shipping.email
			const updated = await shipping.save()
			if (updated) {
				res.status(201).json({
					message: 'Address updated successfully',
					status: 'ok',
					data: updated
				})
			}
		} else {
			const newShipping = await ShippingAddress.create({
				firstName,
				lastName,
				companyName,
				country,
				address,
				appartment,
				town,
				state,
				phoneNumber,
				email,
				user
			})
			if (newShipping) {
				res.status(201).json({
					message: 'Address registered successfully',
					status: 'ok',
					data: newShipping
				})
			}
		}
	} catch (error) {
		next(error);
	}
})

export const get_billing_and_shipping = asyncHandler(async (req, res, next) => {
	try {
		const { user } = req.body
		const billing = await BillingAddress.findOne({ user })
		if (!billing) {
			throw new Error("Not found")
		}
		const shipping = await ShippingAddress.findOne({ user })
		res.status(200).json({
			message: 'Reviews fetched successfully',
			status: 'ok',
			data: {
				billing: billing,
				shipping: shipping
			}
		})
	} catch (error) {
		next(error)
	}
})

export const cart_register = asyncHandler(async (req, res, next) => {
	try {
		const {
			cart,
			user
		} = req.body

		const cartExists = await Cart.findOne({ user })
		if (cartExists) {
			cartExists.cart = cart || cartExists.cart

			const updated = await cartExists.save()
			if (updated) {
				res.status(201).json({
					message: 'Cart updated successfully',
					status: 'ok',
					data: updated.cart
				})
			}
		} else {
			const newCart = await Cart.create({
				cart,
				user
			})
			if (newCart) {
				res.status(201).json({
					message: 'Cart created successfully',
					status: 'ok',
					data: newCart.cart
				})
			}
		}
	} catch (error) {
		next(error);
	}
})

export const wishlist_register = asyncHandler(async (req, res, next) => {
	try {
		const {
			wishlist,
			user
		} = req.body
		const wishlistExists = await Wishlist.findOne({ user })
		if (wishlistExists) {
			wishlistExists.wishlist = wishlist || wishlistExists.wishlist

			const updated = await wishlistExists.save()
			if (updated) {
				res.status(201).json({
					message: 'Wishlist updated successfully',
					status: 'ok',
					data: updated.wishlist
				})
			}
		} else {
			const newWishlist = await Wishlist.create({
				wishlist,
				user
			})
			if (newWishlist) {
				res.status(201).json({
					message: 'Wishlist created successfully',
					status: 'ok',
					data: newWishlist.wishlist
				})
			}
		}
	} catch (error) {
		next(error);
	}
})

export const get_wishlist_and_cart = asyncHandler(async (req, res, next) => {
	try {
		const { user } = req.body
		const wishlist = await Wishlist.findOne({ user })
		const cart = await Cart.findOne({ user })

		res.status(200).json({
			message: 'Fetched successfully',
			status: 'ok',
			data: {
				wishlist: wishlist.wishlist,
				cart: cart.cart
			}
		})
	} catch (error) {
		next(error)
	}
})

export const create_order = asyncHandler(async (req, res, next) => {
	try {
		const {
			cart,
			billingAddress,
			shippingAddress,
			orderNotes,
			owner
		} = req.body

		const order = await Order.create({
			cart,
			billingAddress,
			shippingAddress,
			orderNotes,
			owner
		})

		if (order) {
			res.status(201).json({
				message: 'Order sent successfully',
				status: 'ok',
				data: order
			})
		} else {
			res.status(400)
			throw new Error('Invalid data provided.')
		}
	} catch (error) {
		next(error);
	}
})