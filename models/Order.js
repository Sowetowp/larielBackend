import mongoose from 'mongoose'

const orderSchema = mongoose.Schema(
	{
		cart: [{ type: Object, required: true }],
        billingAddress: { 
            type: mongoose.Schema.Types.ObjectId,
			required: true,
			ref: 'BillingAddress',
        },
        shippingAddress: { 
            type: mongoose.Schema.Types.ObjectId,
			ref: 'ShippingAddress',
        },
		orderNotes: { type: String, require: true},
		status: { type: String, require: true, enum: ["Pending", "Verified", "Approved", "Shipped", "Delivered", "Canceled"], default: "Pending"},
	},
	{
		timestamps: true,
	}
)

const Order = mongoose.model('Order', orderSchema)

export default Order