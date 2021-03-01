const router = require('express').Router();
const { createUser, signIn, signout } = require('../controllers/Auth');
const User = require("../models/user");

router.get('/test', (req, res) => {
  res.send({
    message: "You hit the api"
  })
});

router.post('/user/create', createUser);

router.post('/user/signin', signIn);

router.get('/user/signout', signout)

module.exports = router;