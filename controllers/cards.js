const card = require("../models/card");

const createCard = (req, res) => {
  return card
    .create(req.body)
    .then((crd) => res.status(201).send(crd))
    .catch((error) => {
      if (error.name === "ValidationError") {
        res
          .status(400)
          .send({ message: `Переданы некорректные данные ${error}` });
      } else {
        res.status(500).send({ message: `Ошибка сервера ${error}` });
      }
    });
};

const deleteCard = (req, res) => {
  return card
    .findById({ _id: req.params.id })
    .orFail(() => {
      throw new Error("CardNotFound");
    })
    .then((usr) => res.status(200).send(usr))
    .catch((error) => {
      if (error.name === "CardNotFound") {
        res.status(404).send({ message: `Карточка не найдена ${error}` });
      } else {
        res.status(500).send({ message: `Ошибка сервера ${error}` });
      }
    });
};

const getCards = (req, res) => {
  return card
    .find({})
    .then((crds) => res.status(200).send(crds))
    .catch((error) => {
      res.status(500).send({ message: `Ошибка сервера ${error}` });
    });
};

module.exports = { createCard, deleteCard, getCards };
