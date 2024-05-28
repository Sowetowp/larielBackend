import mongoose from 'mongoose'

const wishlistSchema = mongoose.Schema(
	{
		Wishlist: [{ type: Object, required: true }],
		user: {
			type: mongoose.Schema.Types.ObjectId,
			required: true,
			ref: 'User',
		}
	},
	{
		timestamps: true,
	}
)

const Wishlist = mongoose.model('Wishlist', wishlistSchema)

export default Wishlist