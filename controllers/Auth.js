const User = require("../models/user");
const jwt = require('jsonwebtoken');
const expressJwt = require('express-jwt');

exports.createUser = (req, res) => {
  const user = new User(req.body);

  user.save((err, result) => {
    if(err) {
      console.log(err);
      res.status(400).json({
        error: true,
        err
      })
      return;
    }

    res.status(200).json({
      error: false,
      result
    })
  })
}

exports.signIn = (req, res) => {
  const { username, password } = req.body;
  
  User.findOne({username}, (err, user) => {
    if(err || !user){
      return res.status(400).json({
          error: "User email does not exist"
      });
    }
    if(!user.authenticate(password)){
      return res.status(401).json({
          error:"Email and password do not match"
      });
    }

    const token = jwt.sign({ _id: user._id, admin: user.admin}, process.env.SECRET);

    res.cookie("token", token, {expire: new Date()+99})
    
    const {name, email} = user;
    return res.json({ token, user:{ name, email} })

  })

}

exports.signout = (req, res) => {
  res.clearCookie("token")
    
  res.json({
      error: false,
      message:"User Signout Succesfully"
  });
}

exports.isSignedIn = expressJwt({
  secret: process.env.SECRET,
  algorithms: ['HS256'],
  userProperty: "auth"
})

exports.isAuthenticated = (req, res, next) => {
  let checker = req.profile && req.auth && req.profile._id == req.auth._id;
  if(!checker) {
    return res.status(403).json({
      error: "Access Denied"
    })
  }
}