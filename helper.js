const jwt = require('jsonwebtoken');
const User = require('./models/user');

function parseToken(header) {
  if(header && header.split(' ')[0] == 'Bearer') {
    return header.split(' ')[1];
  }
  return null;
}

const middleware = (req, res, next) => {
  let header = req.headers.authorization;
  const token = parseToken(header);
  if(token === null || token === undefined || token === "undefined") {
    req.token = null;
    req.user = null;
    return next();
  }
  

    jwt.verify(token, process.env.SECRET, (err, doc) => {
      if(err) return res.status(500).json({
        status: 500,
        message: 'Cannot parse token'
      })
      
      User.findById(doc._id)
      .lean()
      .then(user => {
        req.user = user;
        res.setHeader('Authenticated', 'true');
        next();
      })
      .catch((err) => {
        res.status(422).json(err);
      });
    });
};


const perm = (req, res, next) => {
  if(!req.token) {
    return res.status('401').json({
      status: 401,
      message: 'Authorization token is required'
    })
  }

  if(!req.user) {
    return res.status(403).json({
      status: 403,
      message: 'An invalid token was provided'
    })
  }

  if(!req.user.admin || !req.user.staff) {
    return res.json({
      status: 403,
      message: 'Access to this route not permitted!'
    });
  }
  next();
}

module.exports = { middleware, perm };