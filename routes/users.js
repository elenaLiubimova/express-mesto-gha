const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const {
  getUser,
  getCurrentUser,
  getUsers,
  updateUser,
  updateAvatar,
  login,
  createUser,
} = require('../controllers/users');
const { urlPattern } = require('../utils/constants');

router.get('/', getUsers);

router.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
}), login);

router.post('/signup', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi
      .string()
      .pattern(urlPattern),
  }),
}), createUser);

router.get('/:userId', celebrate({
  params: Joi.object().keys({
    userId: Joi.string().alphanum().length(24),
  }),
}), getUser);

router.patch('/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
  }),
}), updateUser);

router.patch('/me/avatar', celebrate({
  body: Joi.object().keys({
    avatar: Joi
      .string()
      .pattern(urlPattern),
  }),
}), updateAvatar);

router.get('/me', getCurrentUser);

module.exports = router;
