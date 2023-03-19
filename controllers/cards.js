const card = require('../models/card');
const {
  notFoundError,
  badRequestError,
  internalServerError,
  createdStatus,
  okStatus,
} = require('../utils/constants');

const createCard = (req, res) => {
  const { name, link } = req.body;
  return card
    .create({ name, link, owner: req.user._id })
    .then((crd) => res.status(createdStatus).send(crd))
    .catch((error) => {
      if (error.name === 'ValidationError') {
        res.status(badRequestError).send({
          message: 'Переданы некорректные данные при создании карточки',
        });
      } else {
        res.status(internalServerError).send({ message: `Ошибка сервера: ${error}` });
      }
    });
};

const deleteCard = (req, res) => card
  .findByIdAndRemove(req.params.cardId)
  .then((crd) => {
    if (!crd) {
      res.status(notFoundError).send({ message: 'Карточка не найдена' });
      return;
    }
    res.send({ data: crd });
  })
  .catch((error) => {
    if (error.name === 'CastError') {
      res
        .status(badRequestError)
        .send({ message: 'Переданы некорректные данные' });
    } else {
      res.status(internalServerError).send({ message: `Ошибка сервера: ${error}` });
    }
  });

const getCards = (req, res) => card
  .find({})
  .then((crds) => res.status(okStatus).send(crds))
  .catch((error) => {
    res.status(badRequestError).send({ message: `Ошибка сервера: ${error}` });
  });

const likeCard = (req, res) => card
  .findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
  .then((crd) => {
    if (!crd) {
      res.status(notFoundError).send({ message: 'Карточка не найдена' });
      return;
    }
    res.send({ data: crd });
  })
  .catch((error) => {
    if (error.name === 'CastError') {
      res.status(badRequestError).send({ message: 'Переданы некорректные данные' });
    } else {
      res.status(internalServerError).send({ message: `Ошибка сервера: ${error}` });
    }
  });

const dislikeCard = (req, res) => card
  .findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
  .then((crd) => {
    if (!crd) {
      res.status(notFoundError).send({ message: 'Карточка не найдена' });
      return;
    }
    res.send({ data: crd });
  })
  .catch((error) => {
    if (error.name === 'CastError') {
      res.status(badRequestError).send({ message: `Пользователь не найден: ${error}` });
    } else {
      res.status(internalServerError).send({ message: `Ошибка сервера: ${error}` });
    }
  });

module.exports = {
  createCard, deleteCard, getCards, likeCard, dislikeCard,
};
