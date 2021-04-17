const router = require('express').Router();
const { createUser, signIn, signout, revokeAccess, addAccess } = require('../controllers/Auth');
const User = require("../models/user");

router.get('/test', (req, res) => {
  res.send({
    message: "You hit the api"
  })
});

router.post('/test', (req, res) => {
  console.log(req.headers);
  return res.json(req.headers);
})

// router.get('/user/get', getUser);

router.post('/user/create', createUser);

router.post('/user/signin', signIn);

router.get('/user/signout', signout)

router.post('/user/access', addAccess);
router.post('/user/revoke-access', revokeAccess);

module.exports = router;