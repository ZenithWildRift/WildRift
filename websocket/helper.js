const Match = require("../models/match");


exports.readyCheck = (team_id, socket) => {
  const check = team_id === "00" ? "checkTeamA" : "checkTeamB";

  Match.findById(socket.match_id).exec((err, match) => {
    if(err) {
      console.log(err);
      return res.status(400).json({
        error:true,
        message: "Cannot find by id"
      })}
      match[check] = true
      
      if((match.checkTeamA === true) && (match.checkTeamB === true)) {
        match.ready = true;
        //OO teamA, 11 teamB
        match.turn= "00";
      }

      match.save((err, result) => {
        if(err) {
          return res.status(400).json({
            error: true,
            message: "Unabe to save character"
          })}
        socket.nsp.to(socket.match_id).emit("checkUpdate", match);
        return;
      })        
  })
}

exports.SelectCharacter = (character, team_id, socket)  => {
  Match.findById(socket.match_id).exec((err, match) => {

    const { bannedCharaters, selectedCharacters } = match;
    if(err) {
      console.log(err);
      return res.status(400).json({
        error:true,
        message: "Cannot find by id"
      })}

      let checkBanned = (bannedCharaters.teamA.length === 3) && (bannedCharaters.teamB.length === 3);
      let checkSelected = (selectedCharacters.teamA.length === 5) && (selectedCharacters.teamB.length === 5);

      // !checkbanned = ban process incomplete
      if(!checkBanned) {
        if(match.turn == "00") {
          match.bannedCharaters.teamA.push(character);
          match.turn = "11";
        } else if(match.turn == "11") {
          match.bannedCharaters.teamB.push(character);
          match.turn = "00";
        }
      }

      if(checkBanned){
        if(match.turn == "00") {
          match.selectedCharacters.teamA.push(character);
          match.turn = "11";
        } else if(match.turn == "11") {
          match.selectedCharacters.teamB.push(character);
          match.turn = "00";
        }
      }
    
      match.save((err, result) => {
        if(err) {
          return res.status(400).json({
            error: true,
            message: "Unabe to save character"
          })}
        socket.nsp.to(socket.match_id).emit("checkUpdate", match);
        return;
      })      

  })
}