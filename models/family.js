const mongoose = require('mongoose');
const familySchema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: [true, 'please enter a title'],
		},
		members: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: 'User',
			},
		],
		createdBy: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User',
		},
	},
	{ timestamps: true }
);

// familySchema.post('save', async function (next) {
// 	const User = mongoose.model('User');
// 	// await User.findByIdAndUpdate(
// 	// 	this.createdBy,
// 	// 	{ family: 'Test' },
// 	// 	{ upsert: true }
// 	// );
// 	next();
// });

module.exports = mongoose.model('Family', familySchema);
