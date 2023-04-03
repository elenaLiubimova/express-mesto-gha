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

router.get('/', getUsers);
router.get('/me', getCurrentUser);

router.get('/:userId', celebrate({
  params: Joi.object().keys({
    userId: Joi.string().hex().length(24).required(),
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

module.exports = router;
