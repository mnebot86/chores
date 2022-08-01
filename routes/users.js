const express = require('express');
const router = express.Router();

const {
	register,
	logIn,
	getAllUsers,
	updateUser,
	getUser,
} = require('../controllers/users');

router.post('/register', register);
router.post('/login', logIn);
router.get('/users', getAllUsers);
router.patch('/users/:userID', updateUser);
router.get('/users/:userID', getUser);

module.exports = router;
