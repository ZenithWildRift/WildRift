// const { Signin, Signup } = require('../controllers/Auth');
var router = require('express').Router();

router.post('/signup', (req, res) => {
  const {username, email, password} = req.body;

  if(!username && !email && !passwword) {
    return res.required(req.body , ['username', 'email', 'password', ]);
  }
  const user = new User({
    username,
    email,
    password
  });
  user.save((err, response) => {
    if(err) {
      return res.status(400).json({
        error: "Unable to save User in Database"
      })
    }
    return res.json({
      username: response.username,
      email: response.email,
    })
  })
});

router.post('/signin', (req, res) => {
  const {email, password} = req.body;

  User.findOne({ email }, (err, user) => {
    if(err && !user) {
      return res.status(400).json({
        error:  "User doesnot exist"
      })
    }
    if(!user.authenticate(password)) {
      return res.status(400).json({
        error:  "Password do not match"
      })
    }

    const token = jwt.sign({ _id: user._id}, process.env.SECRET);
    res.cookie("token", token, {expire: new Date()+9999});

    const { _id, name, email} = user;
    return res.json({ token, user: { _id, name, email }})
  })
});

router.get('/signout', (req, res) => {
  res.clearCookie("token")
  
  res.json({
      message:"USer Signout Succesfully"
  });
})


module.exports = router;