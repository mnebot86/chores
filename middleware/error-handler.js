const { StatusCodes } = require('http-status-codes');

const errorHandlers = (error, req, res, next) => {
	let customError = {
		// set default
		statusCode: error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
		msg: error.message || 'Something went wrong, try again later',
	};
	if (error.name === 'ValidationError') {
		customError.msg = Object.values(error.errors)
			.map((item) => {
				item.message;
			})
			.join(',');
		customError.statusCode = 400;
	}
	if (error.code && error.code === 11000) {
		customError.msg = `Duplicate value entered for ${Object.keys(
			error.keyValue
		)} field, please choose another value`;
		customError.statusCode = 400;
	}
	if (error.name === 'CastError') {
		customError.msg = `No item found with ID ${error.values}`;
		customError.statusCode = 404;
	}
	return res.status(customError.statusCode).json({ msg: customError.msg });
};

module.exports = errorHandlers;
