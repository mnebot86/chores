const express = require('express');
const router = express.Router({ mergeParams: true });

const {
	getAllFamilies,
	getFamily,
	createFamily,
	editFamily,
	deleteFamily,
} = require('../controllers/family');

router.route('/').post(createFamily).get(getAllFamilies);
router
	.route('/:familiesID')
	.get(getFamily)
	.patch(editFamily)
	.delete(deleteFamily);

module.exports = router;
