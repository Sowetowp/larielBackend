import mongoose from 'mongoose'

const adminSchema = mongoose.Schema(
	{
		firstName: { type: String, require: true},
		lastName: { type: String, require: true},
		email: { type: String, require: true, unique: true },
		password: { type: String, require: true },
	},
	{
		timestamps: true,
	}
)

const Admin = mongoose.model('Admin', adminSchema)

export default Admin