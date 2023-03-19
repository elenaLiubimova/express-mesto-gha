const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: [2, 'Минимальная длина значения поля - 2 символа, сейчас - {VALUE} символов'],
    maxlength: [30, 'Максимальная длина значения поля - 30 символов, сейчас - {VALUE} символов'],
  },

  about: {
    type: String,
    required: true,
    minlength: [2, 'Минимальная длина значения поля - 2 символа, сейчас - {VALUE} символов'],
    maxlength: [30, 'Максимальная длина значения поля - 30 символов, сейчас - {VALUE} символов'],
  },

  avatar: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model('user', userSchema);
