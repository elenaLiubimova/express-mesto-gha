const user = require("../models/user");
const {
  notFoundError,
  badRequestError,
  internalServerError,
  createdStatus,
  okStatus,
} = require("../utils/constants");

const createUser = (req, res) => {
  return user
    .create(req.body)
    .then((usr) => res.status(createdStatus).send(usr))
    .catch((error) => {
      if (error.name === "ValidationError") {
        res.status(badRequestError).send({
          message: "Переданы некорректные данные при создании пользователя",
        });
      } else {
        res.status(internalServerError).send({ message: "Ошибка сервера" });
      }
    });
};

const getUser = (req, res) => {
  return user
    .findById(req.params.userId)
    .then((usr) => {
      if (!usr) {
        res.status(notFoundError).send({ message: "Пользователь не найден" });
      }
      res.status(okStatus).send({ data: usr });
    })
    .catch((error) => {
      if (error.name === "CastError" || error.name === "ValidationError") {
        res
          .status(badRequestError)
          .send({ message: "Переданы некорректные данные" });
      } else {
        res.status(internalServerError).send({ message: "Ошибка сервера" });
      }
    });
};

const getUsers = (req, res) => {
  return user
    .find({})
    .then((usrs) => res.status(okStatus).send(usrs))
    .catch((error) => {
      res.status(internalServerError).send({ message: "Ошибка сервера" });
    });
};

const updateUser = (req, res) => {
  const { name, about } = req.body;
  return user
    .findByIdAndUpdate(
      req.user._id,
      { name, about },
      { new: true, runValidators: true }
    )
    .then((usr) => {
      if (!usr) {
        res.status(notFoundError).send({ message: "Пользователь не найден" });
      }
      res.status(okStatus).send({ data: usr });
    })
    .catch((error) => {
      if (error.name === "CastError" || error.name === "ValidationError") {
        res
          .status(badRequestError)
          .send({ message: "Переданы некорректные данные" });
      } else {
        res.status(internalServerError).send({ message: "Ошибка сервера" });
      }
    });
};

const updateAvatar = (req, res) => {
  const { avatar } = req.body;
  return user
    .findByIdAndUpdate(req.user._id, { avatar }, { new: true })
    .orFail(() => {
      throw new Error("UserNotFound");
    })
    .then((usr) => res.send({ data: usr }))
    .catch((error) => {
      if (error.name === "UserNotFound") {
        res.status(404).send({ message: "Пользователь не найден" });
      } else if (error.name === "ValidationError") {
        res.status(400).send({ message: "Переданы некорретные данные" });
      } else {
        res.status(500).send({ message: "Ошибка сервера" });
      }
    });
};

module.exports = { createUser, getUser, getUsers, updateUser, updateAvatar };
