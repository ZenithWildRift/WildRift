const Character = require("../models/character");
const formidable = require("formidable");
const fs = require("fs");
const path = require('path');

exports.getCharacterById = (req, res, next, id) => {
  Character.findById(id).exec((err, char) => {
    if (err) {
      return res.status(400).json({
        error: "Character not found"
      });
    }
    req.character = char;
    next();
  })
}

exports.addCharacter = (req, res) => {
  let form = formidable.IncomingForm({
    multiples: true,
  });
  form.keepExtensions = true;

  form.parse(req, (err, fields, file) => {
    const { name } = fields;

    if(err) {
      return res.status(400).json({
        error: "problem in uploading"
      })
    }

    const character = new Character();
    character.name = name;
    character.id = name.toLowerCase().replace(" ", "_");

    
    if(file.avatar) {
      character.avatar.data = fs.readFileSync(file.avatar.path);
      character.avatar.contentType = file.avatar.type;
    }

    if(file.portrait) {
      character.portrait.data = fs.readFileSync(file.portrait.path);
      character.portrait.contentType = file.portrait.type;
    }
    
    if(file.landscape) {
      character.landscape.data = fs.readFileSync(file.landscape.path);
      character.landscape.contentType = file.landscape.type;
    }

    character.save((err, result) => {
      if(err) {
        res.json.status(400).json({
          error: true,
          message: "Unabe to save character"
        });
      }
      res.status(200).json({
        error: false
      });
    });
  })
}

exports.getAllCharacters = (req, res) => {
  Character.find().select(["-avatar","-landscape","-portrait"]).exec((err, characters) => {
    if (err) {
      res.status(400).json({
        error: true,
        message: "Cannot fetch characters"
      });
    }

    res.json({
      error : false,
      characters
    })
  })
}

exports.getCharImage = (req, res) => {
  let id = req.query.id;
  let type = req.query.type;

  Character.findById(id).lean().exec((err, char) => {
    if(err) {
      res.status(400).json({err})
    }
      var image_data = char[type].data.toString('base64');

      const img = Buffer.from(image_data, 'base64');

      res.writeHead(200, {
        'Content-Type': 'image/png',
        'Content-Length': img.length
      });

      res.end(img); 

  })
}

exports.updateCharacter = (req, res) => {
    let form = formidable.IncomingForm({
    multiples: true,
  });
  form.keepExtensions = true;

  form.parse(req, (err, fields, file) => {
    const { id, name } = fields;

    if(err) {
      return res.status(400).json({
        error: "problem in uploading"
      })
    }

    Character.findById(id).exec((err, character) => {
      if(err) {
        return res.status(400).json({
          error: "Character not found"
        })
      }

      if(name) {
        character.name = name;
        character.id = name.toLowerCase().replace(" ", "_");
      }
      if(file && file.image) {
        character.image.data = fs.readFileSync(file.image.path);
        character.image.contentType = file.image.type;
      }
      
      character.save((err, result) => {
        if(err) {
          res.json.status(400).json({
            error: true,
            message: "Unabe to Update character"
          });
        }
        res.status(200).json(result);
      });
    })
    
    

  })
}

exports.deleteCharacter = (req, res) => {
  let character = req.character;
  character.remove((err, result) => {
    if (err) {
      return res.status(400).json({
        error: "Failed to delete the Character"
      });
    }
    res.json({
      error: false,
    });
  })
}