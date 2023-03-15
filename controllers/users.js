const user = require("../models/user");

const createUser = (req, res) => {
  return user
    .create(req.body)
    .then((usr) => res.status(201).send(usr))
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

const getUser = (req, res) => {
  return user
    .findById(req.user._id)
    .then((usr) => {
      if (!usr) {
        throw new Error("UserNotFound");
      }
    })
    .then((usr) => res.send({ data: usr }))
    .catch((error) => {
      if (error.name === "UserNotFound") {
        res.status(404).send({ message: "Пользователь не найден" });
      } else {
        res.status(500).send({ message: "Ошибка сервера" });
      }
    });
};

const getUsers = (req, res) => {
  return user
    .find({})
    .then((usrs) => res.status(200).send(usrs))
    .catch((error) => {
      res.status(500).send({ message: "Ошибка сервера" });
    });
};

const updateUser = (req, res) => {
  const { name, about } = req.body;
  return user
    .findByIdAndUpdate(req.user._id, { name, about })
    .orFail(() => {
      throw new Error("UserNotFound");
    })
    .then((usr) => res.send({ data: usr }))
    .catch((error) => {
      if (error.name === "UserNotFound") {
        res.status(404).send({ message: `Пользователь не найден ${error}` });
      } else {
        res.status(500).send({ message: `Ошибка сервера ${error}` });
      }
    });
};

const updateAvatar = (req, res) => {
  const { avatar } = req.body;
  return user
    .findByIdAndUpdate(req.user._id, { avatar })
    .orFail(() => {
      throw new Error("UserNotFound");
    })
    .then((usr) => res.send({ data: usr }))
    .catch((error) => {
      if (error.name === "UserNotFound") {
        res.status(404).send({ message: `Пользователь не найден ${error}` });
      } else {
        res.status(500).send({ message: `Ошибка сервера ${error}` });
      }
    });
};

module.exports = { createUser, getUser, getUsers, updateUser, updateAvatar };
