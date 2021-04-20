const User = require("../models/user");

exports.getOrganisations = (req, res) => {
  User.find({staff: true}, (err, result) => {
    res.json(result)
  })
}