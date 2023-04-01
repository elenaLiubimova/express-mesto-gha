const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const {
  getUser,
  getCurrentUser,
  getUsers,
  updateUser,
  updateAvatar,
} = require('../controllers/users');
const { urlPattern } = require('../utils/constants');

router.get('/users', getUsers);

router.get('/users/:userId', celebrate({
  params: Joi.object().keys({
    userId: Joi.string().alphanum().length(24),
  }),
}), getUser);

router.patch('/users/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
  }),
}), updateUser);

router.patch('/users/me/avatar', celebrate({
  body: Joi.object().keys({
    avatar: Joi
      .string()
      .pattern(urlPattern),
  }),
}), updateAvatar);

router.get('/users/me', getCurrentUser);

module.exports = router;
