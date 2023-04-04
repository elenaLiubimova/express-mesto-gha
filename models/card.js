const mongoose = require('mongoose');
const { urlPattern } = require('../utils/constants');

const cardSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: [2, 'Минимальная длина значения поля - 2 символа, сейчас - {VALUE} символов'],
    maxlength: [30, 'Максимальная длина значения поля - 30 символов, сейчас - {VALUE} символов'],
  },

  link: {
    type: String,
    required: true,
    validate: {
      validator: (url) => urlPattern.test(url),
      message: 'Невалидная ссылка',
    },
  },

  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true,
  },

  likes: [{
    type: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
      },
    ],
    default: [],
  }],

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('card', cardSchema);
