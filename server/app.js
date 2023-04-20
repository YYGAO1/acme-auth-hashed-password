const express = require("express");
const path = require("path");
const { Product, User } = require("./db");
const jwt = require("jsonwebtoken");

const app = express();
app.use(express.json());

// static middleware
app.use("/dist", express.static(path.join(__dirname, "../dist")));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../public/index.html"));
});

app.get("/api/products", async (req, res, next) => {
  try {
    res.send(await Product.findAll());
  } catch (ex) {
    next(ex);
  }
});

app.use("/api/auth", require("./routes/auth"));

app.get("/api/users/:id", async (req, res, next) => {
  try {
    const user = await User.findByPk(req.params.id);
    res.send(user);
  } catch (ex) {
    next(ex);
  }
});

app.put("/api/users/:id", async (req, res, next) => {
  try {
    const user = await User.findByPk(req.params.id);
    user.luckyNumber = req.body;
    await user.update();
    res.send(user);
  } catch (ex) {
    next(ex);
  }
});

app.use((err, req, res, next) => {
  console.log(err);
  res.status(err.status || 500).send({ error: err });
});

module.exports = app;
