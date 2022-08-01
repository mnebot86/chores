const express = require('express');
const router = express.Router({ mergeParams: true });

const {
	getAllChores,
	getChore,
	createChore,
	editChore,
	deleteChore,
} = require('../controllers/chores');

router.route('/').post(createChore).get(getAllChores);
router.route('/:choresID').get(getChore).patch(editChore).delete(deleteChore);

module.exports = router;
