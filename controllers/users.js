const user = require("../models/user");
const { NODE_ENV, JWT_SECRET } = process.env;
const {
  notFoundError,
  badRequestError,
  internalServerError,
  createdStatus,
  okStatus,
  unauthorizedError,
} = require("../utils/constants");

const login = (req, res) => {
  const { email, password } = req.body;
  return user
    .findOne({ email })
    .select("+password")
    .orFail(res.status(unauthorizedError)).send({
      message: "Ошибка авторизации",
    })
    .then((usr) =>
      bcrypt.compare(password, usr.password).then((matched) => {
        if (matched) {
          return usr;
        }
        res.status(unauthorizedError).send({
          message: "Ошибка авторизации",
        })
      })
    )
    .then((usr) => {
      const token = jwt.sign(
        { _id: usr._id },
        NODE_ENV === "production" ? JWT_SECRET : "super-strong-secret",
        { expiresIn: "7d" }
      );

      res.send({ token });
    })
    .catch((error) => {
      if (error.name === "ValidationError") {
        res.status(unauthorizedError).send({
          message: "Неверные email и/или пароль",
        });
      } else {
        res.status(internalServerError).send({ message: "Ошибка сервера" });
      }
    });
};

const createUser = (req, res) =>
  user
    .create(req.body)
    .then((usr) => res.status(createdStatus).send(usr))
    .catch((error) => {
      if (error.name === "ValidationError") {
        res.status(badRequestError).send({
          message: `Переданы некорректные данные при создании пользователя: ${error}`,
        });
      } else {
        res.status(internalServerError).send({ message: "Ошибка сервера" });
      }
    });

const getUser = (req, res) =>
  user
    .findById(req.params.userId)
    .then((usr) => {
      if (!usr) {
        res.status(notFoundError).send({ message: "Пользователь не найден" });
        return;
      }
      res.status(okStatus).send({ data: usr });
    })
    .catch((error) => {
      if (error.name === "CastError" || error.name === "ValidationError") {
        res
          .status(badRequestError)
          .send({ message: `Переданы некорректные данные: ${error}` });
      } else {
        res.status(internalServerError).send({ message: "Ошибка сервера" });
      }
    });

const getUsers = (req, res) =>
  user
    .find({})
    .then((usrs) => res.status(okStatus).send(usrs))
    .catch(() => {
      res.status(internalServerError).send({ message: "Ошибка сервера" });
    });

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
        return;
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
      res.status(notFoundError).send({ message: "Пользователь не найден" });
    })
    .then((usr) => res.send({ data: usr }))
    .catch((error) => {
      if (error.name === "ValidationError") {
        res
          .status(badRequestError)
          .send({ message: `Переданы некорректные данные: ${error}` });
      } else {
        res.status(internalServerError).send({ message: "Ошибка сервера" });
      }
    });
};

module.exports = {
  login,
  createUser,
  getUser,
  getUsers,
  updateUser,
  updateAvatar,
};
