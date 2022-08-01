const mongoose = require('mongoose');

const choreSchema = new mongoose.Schema(
	{
		title: {
			type: String,
			required: [true, 'Please provide a title'],
		},

		priority: {
			type: String,
			required: [true, 'please provide ticket priority'],
			enum: ['Low', 'Medium', 'High'],
			default: 'Low',
		},

		description: {
			type: String,
			required: [true, 'Please provide a description'],
		},
		price: {
			type: String,
			default: '0.00',
		},
		progress: {
			type: String,
			enum: ['incomplete', 'in-progress', 'completed'],
			default: 'incomplete',
		},
		createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
		assignee: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User',
		},
		isApproved: {
			type: Boolean,
			default: false,
		},
		dueDate: { type: Date },
	},
	{ timestamps: true }
);

UserSchema.pre('save', async function () {
	const User = mongoose.model('User');

	await User.findByIdAndUpdate(this.assignee, {
		chores: [...chores, this._id],
	});
});

module.exports = mongoose.model('Chore', choreSchema);
