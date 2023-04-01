const handleErrors = (error, req, res) => {
  const { statusCode = 500, message } = error;

  res
    .status(statusCode)
    .send({
      message: statusCode === 500
        ? 'Ошибка сервера'
        : message,
    });
};

module.exports = {
  handleErrors,
};
