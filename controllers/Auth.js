const User = require("../models/user");
const jwt = require('jsonwebtoken');
const expressJwt = require('express-jwt');

exports.isSignedIn = expressJwt({
  secret: process.env.SECRET,
  algorithm: ['HS256'],
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