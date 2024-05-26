import mongoose from 'mongoose'

const billingAddressSchema = mongoose.Schema(
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
		email: { type: String, require: true },
		user: { type: String, require: true }
	},
	{
		timestamps: true,
	}
)

const BillingAddress = mongoose.model('BillingAddress', billingAddressSchema)

export default BillingAddress