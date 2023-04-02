const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const user = require("../models/user");
const { NODE_ENV, JWT_SECRET } = process.env;

const { createdStatus, okStatus } = require("../utils/constants");
const UnauthorizedError = require("../errors/UnauthorizedError");
const ConflictError = require("../errors/ConflictError");
const BadRequestError = require("../errors/BadRequestError");
const NotFoundError = require("../errors/NotFoundError");

const login = (req, res, next) => {
  const { email, password } = req.body;
  user
    .findOne({ email })
    .select("+password")
    .orFail(() => {
      throw new UnauthorizedError("Ошибка доступа");
    })
    .then((usr) =>
      bcrypt.compare(password, usr.password).then((matched) => {
        if (!matched) {
          return Promise.reject(new UnauthorizedError("Ошибка доступа"));
        }
        return res.status(createdStatus).send({
          _id: usr._id,
          name: usr.name,
          about: usr.about,
          avatar: usr.avatar,
          email: usr.email,
        });
      })
    )
    .then((usr) => {
      const token = jwt.sign({ _id: usr._id }, JWT_SECRET, {
        expiresIn: "7d",
      });
      res.send({ jwt: token });
    })
    .catch((error) => {
      next(error);
    });
};

const createUser = (req, res, next) =>
  bcrypt
    .hash(req.body.password, 10)
    .then((hash) =>
      user.create({
        name: req.body.name,
        about: req.body.about,
        avatar: req.body.avatar,
        email: req.body.email,
        password: hash,
      })
    )
    .then((usr) =>
      res.status(createdStatus).send({
        name: usr.name,
        about: usr.about,
        avatar: usr.avatar,
        email: usr.email,
        _id: usr._id,
      })
    )
    .catch((error) => {
      if (error.code === 11000) {
        return next(
          new ConflictError("Пользователь с таким email уже зарегистрирован")
        );
      }
      if (error.name === "ValidationError") {
        return next(
          new BadRequestError(
            "Переданы некорректные данные при создании пользователя"
          )
        );
      }
      return next(error);
    });

getUser = (req, res, next) => {
  user.findById(req.params.userId)
    .orFail(() => {
      return next(new NotFoundError("Пользователь не найден"));
    })
    .then((usr) => res.send({ data: usr }))
    .catch((error) => {
      if (error.name === "CastError") {
        return next(new NotFoundError("Пользователь не найден"));
      } else {
        next(error);
      }
    });
};

getCurrentUser = (req, res, next) => {
  user
    .findById(req.user._id)
    .orFail(() => {
      return next(new NotFoundError("Пользователь не найден"));
    })
    .then((usr) => res.send({ data: usr }))
    .catch((error) => {
      next(error);
    });
};

const getUsers = (req, res, next) =>
  user
    .find({})
    .then((usrs) => res.status(okStatus).send(usrs))
    .catch((error) => next(error));

const updateUser = (req, res, next) => {
  const { name, about } = req.body;
  return user
    .findByIdAndUpdate(
      req.user._id,
      { name, about },
      { new: true, runValidators: true }
    )
    .then((usr) => {
      if (!usr) {
        return next(new NotFoundError("Пользователь не найден"));
      }
      return res.status(okStatus).send({ data: usr });
    })
    .catch((error) => {
      if (error.name === "CastError" || error.name === "ValidationError") {
        return next(new BadRequestError("Переданы некорректные данные"));
      }
      return next(error);
    });
};

const updateAvatar = (req, res, next) => {
  const { avatar } = req.body;
  return user
    .findByIdAndUpdate(req.user._id, { avatar }, { new: true })
    .orFail(() => next(new NotFoundError("Пользователь не найден")))
    .then((usr) => res.send({ data: usr }))
    .catch((error) => {
      if (error.name === "ValidationError") {
        return next(new BadRequestError("Переданы некорректные данные"));
      }
      return next(error);
    });
};

module.exports = {
  login,
  createUser,
  getUser,
  getCurrentUser,
  getUsers,
  updateUser,
  updateAvatar,
};
