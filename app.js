const mongoose = require('mongoose');
const express = require('express');
const usersRouter = require('./routes/users');
const cardsRouter = require('./routes/cards');
const { notFoundError } = require('./utils/constants');

const app = express();

const { PORT = 3000 } = process.env;

mongoose.connect('mongodb://127.0.0.1:27017/mestodb');

app.use(express.json());
app.use((request, resolve, next) => {
  request.user = {
    _id: '640e14465be73267119a6ce2',
  };
  app.use('/', usersRouter);
  app.use('/', cardsRouter);
  app.use('*', (req, res, nxt) => nxt(
    res.status(notFoundError).send({ message: 'Страница не найдена' }),
  ));
  next();
});

app.listen(PORT);
