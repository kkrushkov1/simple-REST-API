const express = require("express");
const mongoose = require("mongoose");
const url = "mongodb://localhost:27017/news";

const app = express();

mongoose.connect(url, {
  family: 4,
});
const con = mongoose.connection;

app.use(express.json());

const newsRouter = require("../project/routers/news");
app.use("/news", newsRouter);

app.listen(27017, () => {
  console.log("Server started");
});
