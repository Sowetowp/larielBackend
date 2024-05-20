import mongoose from 'mongoose'

const productSchema = mongoose.Schema(
	{
		name: { type: String, require: true },
		code: { type: String },
		category: [{ type: String, require: true }],
		imageColor: [{ type: Number }],
        price: { type: Number, require: true },
		quantity: { type: Number },
		description: { type: String, require: true },
        sizes: [{ type: String, require: true }],
		images: [{ type: Object, require: true }],
		colors: [{ type: Object, require: true }],
		prevPrice: { type: Number, default: 0 },
		model: { type: Object },
		status: {type: String, enum: ["Active", "Closed"], default: "Active"}
	},
	{
		timestamps: true,
	}
)

const Product = mongoose.model('Product', productSchema)

export default Product