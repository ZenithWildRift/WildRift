const Match = require("../models/match");
const Character = require("../models/character");
const formidable = require("formidable");
const fs = require("fs");
const path = require("path");
var cloudinary = require("cloudinary").v2;
const { URL } = require("../cofig");

exports.getMatchById = (req, res, next, id) => {
  Match.findById(id).exec((err, match) => {
    if (err) {
      console.log(err);
      res.status(400).json({
        error: true,
        message: "Cannot find by id",
      });
      return;
    }
    req.match = match;
    next();
  });
};

exports.getMatch = (req, res) => {
  let match = req.match;
  res.status(200).json({
    error: false,
    match,
  });
};

exports.createMatch = (req, res) => {
  const user = req.user;
  let form = formidable.IncomingForm({
    multiples: true,
  });
  form.keepExtensions = true;

  form.parse(req, async (err, fields, file) => {
    const {
      name,
      teamA,
      teamB,
      organisation,
      background,
      backgroundA,
      backgroundB,
      textColor,
      selectionBox,
      backgroundImage
    } = fields;

    if (err) {
      return res.status(400).json({});
    }

    const match = new Match();
    match.name = name;
    match.teamA.name = teamA;
    match.teamB.name = teamB;
    match.organisation.name = organisation;
    match.author = user._id;

    match.template.background = background;
    match.template.teamA = backgroundA;
    match.template.teamB = backgroundB;
    match.template.textColor = textColor;
    match.template.selectionBox = selectionBox;


    if (file.imageA) {
      const result = await cloudinary.uploader.upload(file.imageA.path);
      match.teamA.image.url = result.url;
      match.teamA.image.public_id = result.public_id;
    }
    if (file.imageB) {
      const result = await cloudinary.uploader.upload(file.imageB.path);
      match.teamB.image.url = result.url;
      match.teamB.image.public_id = result.public_id;
    }
    if (file.imageOrg) {
      const result = await cloudinary.uploader.upload(file.imageOrg.path);
      match.organisation.image.url = result.url;
      match.organisation.image.public_id = result.public_id;
    }
    if(file.backgroundImage) {
      const result = await cloudinary.uploader.upload(file.backgroundImage.path);
      match.template.backgroundImage.url = result.url;
      match.template.backgroundImage.public_id = result.public_id;
    }

    match.save((err, result) => {
      if (err) {
        res.status(400).json({
          error: true,
          message: "Unabe to save character",
        });
        return;
      }
      res.status(200).json({
        error: false,
        result,
      });
    });
  });
};

exports.deleteMatch = async (req, res) => {
  let match = req.match;
  
  cloudinary.uploader.destroy(match.teamA.image.public_id, (err, result) => {
    if(err) return console.log(err);
  })
  cloudinary.uploader.destroy(match.teamB.image.public_id, (err, result) => {
    if(err) return console.log(err);
  })
  cloudinary.uploader.destroy(match.organisation.image.public_id, (err, result) => {
    if(err) return console.log(err);
  })

  if(match.template.backgroundImage) {
  cloudinary.uploader.destroy(match.template.backgroundImage.public_id, (err, result) => {
    if(err) return console.log({err});
  })
  }

  match.remove((err, result) => {
    if (err) {
      return res.status(400).json({
        error: true,
        message: "Failed to delete the Match",
      });
    }
    res.json({
      error: false,
    });
  });
};

exports.getAllMatches = (req, res) => {
  Match.find().populate('author').exec((err, matches) => {
    if (err) {
      res.status(400).json({
        error: true,
        message: "Cannot fetch Matches",
      });
      console.log(err);
      return;
    }

    res.json({
      error: false,
      matches,
    });
  });
};

exports.createLinks = (req, res) => {
  const { id } = req.body;

  Match.findById(id).exec((err, match) => {
    if (err) {
      res.status(400).json({
        error,
      });
    }
    match.links = {
      teamA: `${URL}/${id}/01`,
      teamB: `${URL}/${id}/10`,
      organisation: `${URL}/${id}/00`,
    };

    match.save((err, result) => {
      if (err) {
        res.status(400).json({
          error: "Updation of product failed",
        });
      }

      res.json(result);
    });
  });
};

const checkFileSize = (file) => {
  for (const image in file) {
    if (image.size > 3000000) {
      return false;
    }
  }
};

exports.resetMatch = (req, res) => {
  const match = req.match;
  match.checkTeamA = false;
  match.checkTeamB = false;
  match.turn = "";
  match.ready = false;
  match.bannedList = [];
  match.bannedCharaters = {
    teamA: [],
    teamB: [],
  };
  match.selectedCharacters = {
    teamA: [],
    teamB: [],
  };
  match.save((err, result) => {
    if (err) {
      res.status(400).json({
        error: "Updation of product failed",
      });
    }
    res.status(200).json({
      error: false,
      result,
    });
  });
};

exports.updateFields = (req, res) => {
  let match = req.match;
  let form = formidable.IncomingForm({
    multiples: true
  });
  form.keepExtensions = true;

  form.parse(req, async (err, fields, file) => {
    const { dataType, selected, value } =  fields;
    switch(dataType) {
      case 'text': 
      if(selected === "name") {
        match.name = value;
        break;
      }
      if(selected.includes('template')) {
        match.template[selected.slice(9)] = value;
        break;
      }
      match[selected].name = value;
      break;
      
      case 'image':
        if(selected.includes('template')) {
          const public_id = match.template.backgroundImage.public_id;

          const result = await cloudinary.uploader.upload(file.image.path);
          match.template.backgroundImage.url = result.url;
          match.template.backgroundImage.public_id = result.public_id;
          
          cloudinary.uploader.destroy(public_id, (err, result) => {
            if(err) return console.log({err});
          })
          break;
        }

        let public_id = match[selected].image.public_id;
        
        const result = await cloudinary.uploader.upload(file.image.path);
        match[selected].image.url = result.url;
        match[selected].image.public_id = result.public_id;
        
        cloudinary.uploader.destroy(public_id, (err, result) => {
          if(err) return console.log({err});
        })
      }
      
      match.save((err, result) => {
        if(err) {
          return res.status(400).json(err);
        }
        return res.status(200).json({message: 'OK'});
      })
    })
  }
    
exports.deleteCustomFields = (req, res) => {
  let match = req.match;
  
  const { selected } = req.body;
  const name = selected.slice(9);
  
  if(name === "backgroundImage") {
    let public_id = match.template.backgroundImage.public_id;
    match.template.backgroundImage = undefined;

    cloudinary.uploader.destroy(public_id, (err, result) => {
      // if(err) return res.status(400).json({error: "There was problem while deleting the image"})
      if(err) console.log({err})
    })
    console.log(match.template);
  } else if(name !== "backgroundImage") {
    match.template[name] = undefined;
  }
  
  match.save((err, result) => {
    if(err) {
      return res.status(400).json({err});
    }
    return res.status(200).json({message: 'OK'});
  })
}