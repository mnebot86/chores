const CustomAPIError = require('./custom-api');
const BadRequestErrors = require('./bad-request');
const NotFoundError = require('./not-found');
const UnauthenticatedError = require('./unauthenticated');

module.exports = {
	CustomAPIError,
	BadRequestErrors,
	NotFoundError,
	UnauthenticatedError,
};
