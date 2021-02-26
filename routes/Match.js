var router = require("express").Router();
var {createMatch, getAllMatches, createLinks, getMatch, getMatchById, deleteMatch, resetMatch} = require("../controllers/Match");

router.param("matchId", getMatchById);

router.get("/match", getAllMatches);

router.get("/match/:matchId", getMatch);

router.post('/match/create', createMatch);

router.post('/match/:matchId/reset', resetMatch)

// router.post('/match/addMatchImages', addMatchImages);

router.post('/match/createLinks', createLinks);

router.post('/match/:matchId/delete', deleteMatch);

module.exports = router;