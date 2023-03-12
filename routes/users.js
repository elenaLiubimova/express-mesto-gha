const router = require('express').Router();
const { createUser, getUser, getUsers } = require('../controllers/users');

router.get('/users', getUsers);

router.get('/users/:userId', getUser);

router.post('/users', createUser);

module.exports = router;