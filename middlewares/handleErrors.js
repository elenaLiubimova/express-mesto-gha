const handleErrors = (error, req, res, next) => {
  const { statusCode = 500, message } = error;

  res
    .status(statusCode)
    .send({
      message: statusCode === 500
        ? 'Ошибка сервера'
        : message,
    });

  next();
};

module.exports = {
  handleErrors,
};
