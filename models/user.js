const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { isEmail } = require('validator');

const UserSchema = new mongoose.Schema(
	{
		firstName: {
			type: String,
			required: [true, 'Please provide first name'],
		},
		lastName: {
			type: String,
			required: [true, 'Please provide last name'],
		},
		email: {
			type: String,
			required: [true, 'Please provide email'],
			validate: {
				validator: isEmail,
				message: 'Please provide valid email',
			},
			unique: true,
		},
		password: {
			type: String,
			required: [
				true,
				'Please provide a password with a minimum length of 6 characters',
			],
			minlength: 6,
			select: false,
		},
		role: {
			type: String,
			enum: ['admin', 'parent', 'child'],
			required: [true, 'Please select a role'],
		},
		family: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Family',
		},
		chores: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: 'Chore',
			},
		],
	},
	{ minimize: false },
	{ timestamps: true }
);

UserSchema.pre('save', async function () {
	const salt = await bcrypt.genSalt(10);
	this.password = await bcrypt.hash(this.password, salt);
});

UserSchema.methods.createJWT = function () {
	return jwt.sign(
		{
			userId: this._id,
			firstName: this.firstName,
			lastName: this.lastName,
			email: this.email,
			role: this.role,
			family: this.family,
			chores: this.chores,
		},
		process.env.JWT_SECRET,
		{
			expiresIn: process.env.JWT_LIFETIME,
		}
	);
};

UserSchema.methods.comparePassword = async function (candidatesPassword) {
	const isMatch = await bcrypt.compare(candidatesPassword, this.password);
	return isMatch;
};

module.exports = mongoose.model('User', UserSchema);
