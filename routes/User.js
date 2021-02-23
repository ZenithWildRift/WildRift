const router = require('express').Router();
// const { Signup } = require('../controllers/Auth');
// const User = require("../models/user");

router.get('/', (req, res) => {
  res.send({
    message: "You hit the api"
  })
});

module.exports = router;