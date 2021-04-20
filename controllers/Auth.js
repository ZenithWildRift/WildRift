const User = require("../models/user");
const jwt = require('jsonwebtoken');
const expressJwt = require('express-jwt');

exports.createUser = (req, res) => {
  const {email, password, type, username, organisation} = req.body;
  const user = new User();
  user.email = email;
  user.password = password;
  user.username = username;
  user.organisation_name = organisation;

  user.save((err, result) => {
    if(err) {
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

exports.getUser = (req, res) => {
  const { id } = req.body;

  User.findById(id, (err, user) => {
    if(err) {
      return res.status(404).json({
        message: "Can't find the user"
      })
    }
    res.status(200).json({
      message: 'Ok',
      user
    })
  })
}

exports.signIn = (req, res) => {
  const { email, password } = req.body;
  
  User.findOne({ email }, (err, user) => {
    if(err || !user){
      return res.status(404).json({
          message: "User not found"
      });
    }
    if(!user.authenticate(password)){
      return res.status(401).json({
          messasge:"Email and password do not match"
      });
    }
    
    if(!user.staff && !user.admin) {
      return res.status(401).json({message: "Access not verified. Contact admins"})
    }

    const jwtBody = { _id: user._id, admin: user.admin, staff: user.staff, organisation: user.organisation, organisation_name: user.organisation_name}

    const token = jwt.sign( jwtBody, process.env.SECRET);

    res.cookie("token", token, {expire: new Date()+99})
    
    return res.json(token);

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

exports.addAccess = (req, res) => {
  let user = req.user;
  const {email} = req.body;
  if(user.admin) {
    User.findOneAndUpdate({ email }, {staff: true}, {new: true}, (err, result) => {
      if(err) {
        return res.status(400).json({err});
      }
      res.status(200).json({ message: 'OK'});
    });
  }
}

exports.revokeAccess = (req, res) => {
  let user = req.user;
  const {email} = req.body;
  if(user.admin) {
    User.findOneAndUpdate({ email }, {staff: false}, {new: true }, (err, response) => {
      if(err) {
        return res.status(400).json({err});
      }
      res.status(200).json({ message: 'OK'});
    });
  }
}

