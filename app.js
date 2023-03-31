require('dotenv').config();
const mongoose = require('mongoose');
const express = require('express');
const { notFoundError } = require('./utils/constants');

const { createUser, login } = require('./controllers/auth');
const auth = require('./middlewares/auth');

const { PORT = 3000 } = process.env;

const app = express();

mongoose.connect('mongodb://127.0.0.1:27017/mestodb');

app.use(express.json());

app.post('/signin', login);
app.post('/signup', createUser);

app.use(auth);

app.use('/', require('./routes/users'));
app.use('/', require('./routes/cards'));

app.use('*', (req, res, next) => next(
  res.status(notFoundError).send({ message: 'Страница не найдена' }),
));

app.use(errors);

app.listen(PORT);
