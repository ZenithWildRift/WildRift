var router = require("express").Router();
var cors = require('cors')

const { addCharacter, getAllCharacters, getCharacterById, getCharImage, deleteCharacter, updateCharacter } = require("../controllers/Characters");

router.param("charId", getCharacterById);

router.get('/characters', cors(), getAllCharacters);
// id:  char Object id
// type: avatar|landscape|portrait
router.get('/getcharimage', getCharImage)

router.post("/characters/add", addCharacter);

router.post("/characters/update", updateCharacter);

//delete
router.post("/character/:charId/delete", deleteCharacter);

module.exports = router;