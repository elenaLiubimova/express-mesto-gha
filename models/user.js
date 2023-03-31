const mongoose = require('mongoose');
const validator = require('validator');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    default: 'Жак-Ив Кусто',
    required: true,
    minlength: [2, 'Минимальная длина значения поля - 2 символа, сейчас - {VALUE} символов'],
    maxlength: [30, 'Максимальная длина значения поля - 30 символов, сейчас - {VALUE} символов'],
  },

  about: {
    type: String,
    default: 'Исследователь',
    required: true,
    minlength: [2, 'Минимальная длина значения поля - 2 символа, сейчас - {VALUE} символов'],
    maxlength: [30, 'Максимальная длина значения поля - 30 символов, сейчас - {VALUE} символов'],
  },

  avatar: {
    type: String,
    default: 'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',
    validate: {
      validator: (url) => /https?:\/\/(www\.)?[-0-9a-zA-Z@:%._+~#=]{1,256}\.[-0-9a-zA-Z()]{1,6}\b([-0-9a-zA-Z()@:%_+.~#?&//=]*)/.test(url),
      message: 'email is not valid',
    },
    required: true,
  },

  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: (email) => validator.isEmail(email),
      message: 'Введен некорректный email',
    },
  },

  password: {
    type: String,
    required: true,
    select: false
  }
});

module.exports = mongoose.model('user', userSchema);
