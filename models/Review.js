import mongoose from 'mongoose'

const reviewSchema = mongoose.Schema(
	{
		rating: { type: Number, require: true },
        product: { 
            type: mongoose.Schema.Types.ObjectId,
			required: true,
			ref: 'Product',
        },
		review: { type: String, require: true},
		email: { type: String, require: true },
		name: { type: String, require: true },
        approved: { type: Boolean, default: false}
	},
	{
		timestamps: true,
	}
)

const Review = mongoose.model('Review', reviewSchema)

export default Review