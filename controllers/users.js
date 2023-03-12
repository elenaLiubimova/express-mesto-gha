const user = require("../models/user");

const createUser = (req, res) => {
  return user
    .create(req.body)
    .then((usr) => res.status(201).send(usr))
    .catch((error) => {
      if (error.name === "ValidationError") {
        res
          .status(400)
          .send({ message: `Переданы некорректные данные ${error}` });
      } else {
        res
          .status(500)
          .send({ message: `Ошибка сервера ${error}` });
      }
    });
};

const getUser = (req, res) => {
  return user
    .findById({ _id: req.params.id })
    .orFail(() => {
      throw new Error('Пользователь не найден')
    })
    .then((usr) => res.status(201).send(usr))
    .catch((error) => {
      if (error.name === "UserNotFound") {
        res
          .status(404)
          .send({ message: `Пользователь не найден ${error}` });
      } else {
        res
          .status(500)
          .send({ message: `Ошибка сервера ${error}` });
      }
    })
};

const getUsers = (req, res) => {};

module.exports = { createUser, getUser, getUsers };
