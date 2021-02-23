var router = require("express").Router();
var {createMatch, addMatchImages, createLinks} = require("../controllers/Match");

router.get("/match", (req, res) => {
  res.send({
    message: 'boom badam'
  })
})

router.post('/match/create', createMatch);
router.post('/match/addMatchImages', addMatchImages);

router.post('/match/createLinks', createLinks);

module.exports = router;