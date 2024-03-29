require('dotenv').config();
const http = require('http');
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const app = express();
const server = http.createServer(app)
const { middleware } = require('./helper');

global.server = server;

// DB connection
mongoose.connect(process.env.DATABASE1,  {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
  useFindAndModify: false 
}).then(() => {
  console.log("DB CONNECTED");
});

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization ");
  next();
});

const io = require("./websocket/index");

// MIDDLEWARES
// app.use(cors());
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(cookieParser());

app.use(middleware);
//Register Routes
app.use("/api", require('./routes/Auth'));
app.use("/api", require('./routes/Match'));
app.use("/api", require('./routes/User'));
app.use("/api", require('./routes/Characters'));

app.use((err, req, res, next) => {
  console.log(err);
})

// PORT
const port = process.env.PORT || 8000;

// START SERVER
server.listen(port , () => {
  console.log(`app is running at port ${port}`)
});

