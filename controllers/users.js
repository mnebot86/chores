const User = require('../models/user');
const { StatusCodes } = require('http-status-codes');
const { BadRequestErrors, UnauthenticatedError } = require('../errors');

const register = async (req, res) => {
	const { firstName, lastName, email, password, role } = req.body;
	const userExists = await User.findOne({ email });

	if (!firstName || !lastName || !email || !password || !role) {
		throw new BadRequestErrors('Please provide all values');
	}

	if (userExists) {
		throw new BadRequestErrors('Email already in use');
	}
	const user = await User.create({ ...req.body });
	const token = user.createJWT();

	//TODO: Can still see password when created
	res.status(StatusCodes.CREATED).json({
		data: { firstName, lastName, email },
		token,
	});
};

const logIn = async (req, res) => {
	const { email, password } = req.body;
	if (!email || !password) {
		throw new BadRequestErrors('Please provide email and password');
	}

	const user = await User.findOne({ email }).select('+password');

	if (!user) {
		throw new UnauthenticatedError('Invalid credentials');
	}

	const isPasswordCorrect = await user.comparePassword(password);
	if (!isPasswordCorrect) {
		throw new UnauthenticatedError('Invalid credentials');
	}

	const token = user.createJWT();
	res.status(StatusCodes.OK).json({
		user: { firstName: user.firstName, id: user._id },
		token,
	});
};

const getAllUsers = async (req, res) => {
	const { query } = req;
	console.log({ query });
	let users;

	if (!query) users = await User.find({});
	else users = await User.find(query);
	res.status(StatusCodes.OK).json({ users });
};

const updateUser = async (req, res) => {
	const {
		params: { userID },
		body,
	} = req;

	const user = await User.findByIdAndUpdate(userID, body, {
		new: true,
		runValidators: true,
	});

	if (!user) {
		throw new NotFoundError('does not exist');
	}

	res.status(StatusCodes.OK).json({ user });
};

const getUser = async (req, res) => {
	const {
		params: { userID },
	} = req;

	const user = await User.findOne({ _id: userID }).populate({
		path: 'family',
		model: 'Family',
		populate: {
			path: 'members',
			// path: 'chores',
		},
	});

	if (!user) {
		throw new NotFoundError('does not exist');
	}

	res.status(StatusCodes.OK).json({ user });
};

module.exports = {
	register,
	logIn,
	getAllUsers,
	updateUser,
	getUser,
};
