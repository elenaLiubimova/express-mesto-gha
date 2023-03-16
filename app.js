const mongoose = require("mongoose");
const express = require("express");
const usersRouter = require("./routes/users");
const cardsRouter = require("./routes/cards");

const app = express();

const { PORT = 3000 } = process.env;

mongoose.connect("mongodb://127.0.0.1:27017/mestodb");

app.use(express.json());
app.use((req, res, next) => {
  req.user = {
    _id: "640e14465be73267119a6ce2",
  };
  app.use("/", usersRouter);
  app.use("/", cardsRouter);

  next();
});

app.listen(PORT);
