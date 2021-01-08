const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const app = express();

// Router
const covidRouter = require("./router/covid");

// PORT
const port = 4000;

// Express Setup
app.use(bodyParser.json());
app.use(cors());
app.use(covidRouter);

app.get("/", (req, res) => {
  return res.send({ msg: `Server is up on port ${port}` });
});

app.listen(process.env.PORT || 3000, () => {
  console.log(`Server is up on port ${port}`);
});
