const Chore = require('../models/chore');
const { StatusCodes } = require('http-status-codes');
const { BadRequestErrors, NotFoundError } = require('../errors');

const getAllChores = async (req, res) => {
	const chores = await Chore.find({});
	res.status(StatusCodes.OK).json({ chores, count: chores.length });
};

const getChore = async (req, res) => {
	const {
		params: { choresID },
	} = req;
	const chore = await Chore.findById(choresID);

	if (!chore) {
		throw new NotFoundError('does not exist');
	}
	res.status(StatusCodes.OK).json({ chore });
};

const createChore = async (req, res) => {
	const chore = await Chore.create(req.body);
	res.status(StatusCodes.CREATED).json({ chore });
};

const editChore = async (req, res) => {
	const {
		params: { choresID, body: name },
	} = req;

	if (name == '') {
		throw new BadRequestErrors('Title field cannot be empty');
	}
	const chore = await Chore.findByIdAndUpdate(choresID, req.body, {
		new: true,
		runValidators: true,
	});

	if (!chore) {
		throw new NotFoundError('does not exist');
	}

	res.status(StatusCodes.OK).json({ chore });
};

const deleteChore = async (req, res) => {
	const {
		params: { choresID },
	} = req;

	const chore = await Chore.findByIdAndDelete(choresID);

	if (!chore) {
		throw new NotFoundError(`No project with ID ${choresID}`);
	}

	res.status(StatusCodes.OK).json({ msg: 'Deleted successfully' });
};

module.exports = {
	getAllChores,
	getChore,
	createChore,
	editChore,
	deleteChore,
};
