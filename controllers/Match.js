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
  let form = formidable.IncomingForm({
    multiples: true,
  });
  form.keepExtensions = true;

  error: "problem with files";
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
    } = fields;

    if (err) {
      return res.status(400).json({});
    }

    const match = new Match();

    match.name = name;
    match.teamA.name = teamA;
    match.teamB.name = teamB;
    match.organisation.name = organisation;

    match.template.background = background;
    match.template.teamA = backgroundA;
    match.template.teamB = backgroundB;
    match.template.textColor = textColor;
    match.template.selectionBox = selectionBox;

    if (file.imageA) {
      const result = await cloudinary.uploader.upload(file.imageA.path);
      match.teamA.image = result.url;
    }
    if (file.imageB) {
      const result = await cloudinary.uploader.upload(file.imageB.path);
      match.teamB.image = result.url;
    }
    if (file.imageOrg) {
      const result = await cloudinary.uploader.upload(file.imageOrg.path);
      match.organisation.image = result.url;
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

exports.deleteMatch = (req, res) => {
  let match = req.match;
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
  Match.find().exec((err, matches) => {
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
