require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const serverless = require("serverless-http");
var router = require("express").Router();
const app = express();

// DB connection
mongoose.connect("mongodb+srv://zenith:zenith@zenithwildrift.td1rf.mongodb.net/zenithwildrift?retryWrites=true&w=majority",  {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true
}).then(() => {
  console.log("DB CONNECTED");
});


// MIDDLEWARES
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(cookieParser());
app.use(cors());

//Register Routes
router.get(`/`, (req, res)=> {
  res.json({
    message: "bpoom bam"
  })
})

app.use('/.netlify/functions/app', router);
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

module.exports = app;

module.exports.handler = serverless(app);
