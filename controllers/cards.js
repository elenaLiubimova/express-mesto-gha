const card = require("../models/card");
const {
  notFoundError,
  badRequestError,
  internalServerError,
  createdStatus,
  okStatus,
} = require("../utils/constants");

const createCard = (req, res) => {
  const { name, link } = req.body;
  return card
    .create({ name, link, owner: req.user._id })
    .then((crd) => res.status(createdStatus).send(crd))
    .catch((error) => {
      if (error.name === "ValidationError") {
        res.status(badRequestError).send({
          message: "Переданы некорректные данные при создании карточки",
        });
      } else {
        res.status(internalServerError).send({ message: "Ошибка сервера" });
      }
    });
};

const deleteCard = (req, res) => {
  return card
    .findByIdAndRemove(req.params.cardId)
    .then((crd) => {
      if (!card) {
        res.status(notFoundError).send({ message: "Карточка не найдена" });
      }
      res.send({ data: crd })
    })
    .catch((error) => {
      if (error.name === "CastError") {
        res.status(notFoundError).send({ message: "Карточка не найдена " });
      } else {
        res.status(badRequestError).send({ message: "Ошибка сервера" });
      }
    });
};

const getCards = (req, res) => {
  return card
    .find({})
    .then((crds) => res.status(okStatus).send(crds))
    .catch((error) => {
      res.status(badRequestError).send({ message: "Ошибка сервера" });
    });
};

const likeCard = (req, res) => {
  return card
    .findByIdAndUpdate(
      req.params.cardId,
      { $addToSet: { likes: req.user._id } },
      { new: true }
    )
    .then((card) => {
      if (!card) {
        res.status(notFoundError).send({ message: "Карточка не найдена" });
      }
      res.send({ data: card });
    })
    .catch((err) => {
      if (err.name === "CastError") {
        res.status(badRequestError).send({ message: "Переданы некорректные данные" });
      } else {
        res.status(internalServerError).send({ message: "Ошибка сервера" });
      }
    });
};

const dislikeCard = (req, res) => {
  return card
    .findByIdAndUpdate(
      req.params.cardId,
      { $pull: { likes: req.user._id } },
      { new: true }
    )
    .then((card) => {
      if (!card) {
        res.status(notFoundError).send({ message: "Карточка не найдена" });
      }
      res.send({ data: card });
    })
    .catch((err) => {
      if (err.name === "CastError") {
        res.status(badRequestError).send({ message: "Пользователь не найден" });
      } else {
        res.status(internalServerError).send({ message: "Ошибка сервера" });
      }
    });
};

module.exports = { createCard, deleteCard, getCards, likeCard, dislikeCard };
