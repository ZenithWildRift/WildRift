const Match = require('../models/match');
const formidable = require("formidable");
const fs = require('fs');
const path = require('path');
const { URL } = require("../cofig");

exports.createMatch = (req, res) => {
  const { name, teamA, teamB , organisation } = req.body;

  const match = new Match();

  match.name = name;
  match.teamA.name = teamA;
  match.teamB.name = teamB;
  match.organisation.name = organisation;

  match.save((err, result) => {
    if(err) {
      res.status(400).json({
        message:  "Cannot save match"
      })
    }
    res.status(200).json(result);
  })

}

exports.addMatchImages = (req, res) => {
  let form = new formidable({multiples : true});
  form.keepExtensions = true;

  form.parse(req, (err, fields, files) => {
    const { id } = fields;
    if(err) {
      return res.status(400).json({
        error: "problem with image"
      });
    }
    
    // if(!checkFileSize(file)) {
    //   return res.status(400).json({
    //     error: "File size is too big"
    //   })
    // }

    Match.findById(id).exec((err, match) => {
      if(err) {
        return res.status(400).json({
          error: "Match not found"
        })
      }

      match.teamA.image.data = fs.readFileSync(files.teamA.path);
      match.teamA.image.contentType = files.teamA.type;

      match.teamB.image.data = fs.readFileSync(files.teamB.path);
      match.teamB.image.contentType = files.teamB.type;
      
      match.organisation.image.data = fs.readFileSync(files.organisation.path);
      match.organisation.image.contentType = files.organisation.type;

      match.save((err, result) => {
        if (err) {
          res.status(400).json({
            error: "Updation of product failed"
          });
        }
        res.json(result);
      })
    }) 

  });
}

// exports.customTheme = (req, res) => {
//   const { header, background, teamA, teamB } = req.body;
// }

exports.createLinks =(req, res) => {
  const { id } = req.body;

  Match.findById(id).exec((err, match) => {
    if (err) {
      res.status(400).json({
        error
      });
    }
    match.links = {
      teamA: `${URL}/${id}/01`,
      teamB: `${URL}/${id}/10`,
      organisation: `${URL}/${id}/00`,
    }

    match.save((err, result) => {
      if (err) {
        res.status(400).json({
          error: "Updation of product failed"
        });
      }

      res.json(result);
    })

  })
}

const checkFileSize = (file) => {
  for(const image in file){
    if(image.size > 3000000){
      return false;
    }
  }
}
