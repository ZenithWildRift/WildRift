require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const app = express();


// DB connection
mongoose.connect(process.env.DATABASE1,  {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true
}).then(() => {
  console.log("DB CONNECTED");
});

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

// MIDDLEWARES
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(cookieParser());
app.use(cors());

//Register Routes
app.use("/api", require('./routes/Auth'));
app.use("/api", require('./routes/Match'));
app.use("/api", require('./routes/User'));
app.use("/api", require('./routes/Characters'));



// PORT
const port = process.env.PORT || 8000;

// START SERVER
app.listen(port , () => {
  console.log(`app is running at port ${port}`)
});

