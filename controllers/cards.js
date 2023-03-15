const card = require("../models/card");

const createCard = (req, res) => {
  const { name, link } = req.body;
  return card
    .create({ name, link, owner: req.user._id })
    .then((crd) => res.status(201).send(crd))
    .catch((error) => {
      if (error.name === "ValidationError") {
        res
          .status(400)
          .send({ message: "Переданы некорректные данные при создании пользователя" });
      } else {
        res.status(500).send({ message: "Ошибка сервера" });
      }
    });
};

const deleteCard = (req, res) => {
  return card
    .findByIdAndRemove(req.params.cardId)
    .orFail(() => {
      throw new Error("CardNotFound");
    })
    .then((crd) => res.send({ data: crd }))
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

const likeCard = (req, res) => {
  return card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true }
  );
};

const dislikeCard = (req, res) => {
  return card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true }
  );
};

module.exports = { createCard, deleteCard, getCards, likeCard, dislikeCard };
