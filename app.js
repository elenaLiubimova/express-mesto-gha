const mongoose = require('mongoose');
const express = require("express");
const path = require('path')
const usersRouter = require('./routes/users');

const app = express();

const { PORT = 3000 } = process.env;

mongoose.connect('mongodb://127.0.0.1:27017/mestodb');

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/', usersRouter);

app.listen(PORT);