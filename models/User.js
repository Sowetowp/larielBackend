import mongoose from 'mongoose'

const userSchema = mongoose.Schema(
	{
		firstName: { type: String},
		lastName: { type: String},
		displayName: { type: String},
		email: { type: String, require: true, unique: true },
		password: { type: String, require: true },
	},
	{
		timestamps: true,
	}
)

const User = mongoose.model('User', userSchema)

export default User