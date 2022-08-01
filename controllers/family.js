const Family = require('../models/family');
const mongoose = require('mongoose');
const { StatusCodes } = require('http-status-codes');
const { BadRequestErrors, NotFoundError } = require('../errors');

const getAllFamilies = async (req, res) => {
	const { query: user } = req;
	const userID = user.user;
	let families;

	if (!userID) {
		families = await Family.find({});
	} else {
		families = await Family.find({ createdBy: userID });
	}

	res.status(StatusCodes.OK).json({ families, count: families.length });
};

const getFamily = async (req, res) => {
	const {
		params: { familiesID },
	} = req;
	const family = await Family.findById(familiesID).populate('members');

	if (!family) {
		throw new NotFoundError('does not exist');
	}
	res.status(StatusCodes.OK).json({ family });
};

const createFamily = async (req, res) => {
	const user = mongoose.model('User');
	const id = req.body.createdBy;

	const family = await Family.create(req.body).then(async (family) => {
		await user.findByIdAndUpdate(
			{ _id: id },
			{
				family: {
					...family,
				},
			}
		);
	});

	res.status(StatusCodes.CREATED).json({ family });
};

const editFamily = async (req, res) => {
	const {
		params: { familiesID, body: name },
	} = req;

	if (name == '') {
		throw new BadRequestErrors('Title field cannot be empty');
	}
	const family = await Family.findByIdAndUpdate(familiesID, req.body, {
		new: true,
		runValidators: true,
	});

	if (!family) {
		throw new NotFoundError('does not exist');
	}

	res.status(StatusCodes.OK).json({ family });
};

const deleteFamily = async (req, res) => {
	const {
		params: { familiesID },
	} = req;

	const family = await Family.findByIdAndDelete(familiesID);

	if (!family) {
		throw new NotFoundError(`No project with ID ${familiesID}`);
	}

	res.status(StatusCodes.OK).json({ msg: 'Deleted successfully' });
};

module.exports = {
	getAllFamilies,
	getFamily,
	createFamily,
	editFamily,
	deleteFamily,
};
