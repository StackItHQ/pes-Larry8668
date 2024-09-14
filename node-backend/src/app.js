const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const syncRoutes = require("./routes/syncRoutes");
const errorHandler = require("./middlewares/errorHandler");

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.use("/api", syncRoutes);

app.use(errorHandler);

app.get("/", (req, res) => {
  res.send("It's working!");
});

module.exports = app;
