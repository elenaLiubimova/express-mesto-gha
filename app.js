require('dotenv').config();
const mongoose = require('mongoose');
const express = require('express');
const { errors, Joi, celebrate } = require('celebrate');
const { notFoundError, urlPattern } = require('./utils/constants');

const { createUser, login } = require('./controllers/users');
const auth = require('./middlewares/auth');
const { handleErrors } = require('./middlewares/handleErrors');
const NotFoundError = require('./errors/NotFoundError');

const { PORT = 3000 } = process.env;

const app = express();

mongoose.connect('mongodb://127.0.0.1:27017/mestodb');

app.use(express.json());

// роуты, не требующие авторизации
app.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
}), login);

app.post('/signup', celebrate({
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

// роуты, которым авторизация нужна
app.use('/users', auth, require('./routes/users'));
app.use('/cards', auth, require('./routes/cards'));

app.use((req, res, next) => next(new NotFoundError('Страница не найдена')));

app.use(errors());
app.use(handleErrors);

app.listen(PORT);
