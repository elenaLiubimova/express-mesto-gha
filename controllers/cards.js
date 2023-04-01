const BadRequestError = require('../errors/BadRequestError');
const ForbiddenError = require('../errors/ForbiddenError');
const NotFoundError = require('../errors/NotFoundError');
const card = require('../models/card');
const {
  createdStatus,
  okStatus,
} = require('../utils/constants');

const createCard = (req, res, next) => {
  const { name, link } = req.body;
  return card
    .create({ name, link, owner: req.user._id })
    .then((crd) => res.status(createdStatus).send(crd))
    .catch((error) => {
      if (error.name === 'ValidationError') {
        return next(new BadRequestError('Переданы некорректные данные при создании карточки'));
      }
      return next(error);
    });
};

const deleteCard = (req, res, next) => card
  .findById(req.params.cardId)
  .orFail(() => next(new NotFoundError('Карточка не найдена')))
  .then((usr) => {
    if (JSON.stringify(req.user._id) !== JSON.stringify(usr.owner)) {
      return next(new ForbiddenError('Отказано в доступе'));
    }
    return card.deleteOne();
  })
  .then((сrd) => {
    res.send({ сrd });
  })
  .catch((error) => {
    if (error.name === 'CastError') {
      return next(new BadRequestError('Переданы некорректные данные при удалении карточки'));
    }
    return next(error);
  });

const getCards = (req, res, next) => card
  .find({})
  .then((crds) => res.status(okStatus).send(crds))
  .catch(() => next(new BadRequestError('Некорректные данные')));

const likeCard = (req, res, next) => card
  .findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
  .then((crd) => {
    if (!crd) {
      return next(new NotFoundError('Карточка не найдена'));
    }
    return res.send({ data: crd });
  })
  .catch((error) => {
    if (error.name === 'CastError') {
      return next(new BadRequestError('Переданы некорректные данные'));
    }
    return next(error);
  });

const dislikeCard = (req, res, next) => card
  .findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
  .then((crd) => {
    if (!crd) {
      return next(new NotFoundError('Карточка не найдена'));
    }
    return res.send({ data: crd });
  })
  .catch((error) => {
    if (error.name === 'CastError') {
      return next(new BadRequestError('Пользователь не найден'));
    }
    return next(error);
  });

module.exports = {
  createCard,
  deleteCard,
  getCards,
  likeCard,
  dislikeCard,
};
