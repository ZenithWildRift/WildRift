var router = require("express").Router();
var {
  createMatch,
  getAllMatches,
  createLinks,
  getMatch,
  getMatchById,
  deleteMatch,
  resetMatch,
  updateFields,
  deleteCustomFields
} = require("../controllers/Match");

router.param("matchId", getMatchById);

router.get("/match", getAllMatches);

router.get("/match/:matchId", getMatch);

router.post("/match/create", createMatch);

router.post("/match/:matchId/reset", resetMatch);

// router.post('/match/addMatchImages', addMatchImages);

router.post("/match/createLinks", createLinks);

router.post("/match/:matchId/delete", deleteMatch);

// ------ Update Routes ------

router.post("/match/:matchId/update", updateFields);

// DELETE FIELDS
router.post('/match/:matchId/deleteCustomFields', deleteCustomFields);

module.exports = router;
