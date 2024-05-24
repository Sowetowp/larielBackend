import mongoose from 'mongoose'

const shippingAddressSchema = mongoose.Schema(
	{
		firstName: { type: String, require: true},
		lastName: { type: String, require: true},
		companyName: { type: String},
		country: { type: String, require: true},
		address: { type: String, require: true},
		appartment: { type: String},
		town: { type: String},
		state: { type: String, require: true},
		phoneNumber: { type: String, require: true},
		email: { type: String, require: true, unique: true },
		user: { type: String, require: true, unique: true }
	},
	{
		timestamps: true,
	}
)

const ShippingAddress = mongoose.model('ShippingAddress', shippingAddressSchema)

export default ShippingAddress