const errors = (error, req, res, next) => {
  let message;

  if (error.statusCode === 500) {
    message = `Ошибка сервера: ${error.message}`;
  } else {
    message = error.message;
  }

  res.status(error.statusCode).send({ message });

  next();
};

module.exports = {
  errors,
};
