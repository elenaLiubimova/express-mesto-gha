const router = require('express').Router();
const { createCard, deleteCard, getCards } = require('../controllers/cards');

router.get('/cards', getCards);

router.post('/cards', createCard);

router.delete('/cards/:cardId', deleteCard);

module.exports = router;