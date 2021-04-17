const Match = require("../models/match");


exports.readyCheck = (team_id, socket, next) => {
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
      })        
  })
  next();
}

exports.SelectCharacter = (character, index, team_id, socket)  => {
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

      match.bannedList.push(index);
      if(checkBanned) {
        match.turn = checkTurns(match);
      }

      console.log(match.turn);
    
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

// const Timer = (socket) => {

// }



const checkTurns = (match) => {
  const {selectedCharacters} = match;
  const {teamA, teamB} = selectedCharacters;
  if(selectedCharacters.teamA.length === 1 && teamB.length === 0) {
    return "11"; //2
  } else if (teamA.length === 1 && teamB.length === 1) {
    return "11";//3
  } else if (teamA.length === 1 && teamB.length === 2) {
    return "00";//4
  } else if (teamA.length === 2 && teamB.length === 2) {
    return "00";//
  } else if (teamA.length === 3 && teamB.length === 2) {
    return "11";//
  } else if (teamA.length === 3 && teamB.length === 3) {
    return "11";//
  } else if (teamA.length === 3 && teamB.length === 4) {
    return "00";//
  } else if (teamA.length === 4 && teamB.length === 4) {
    return "00";//
  } else if (teamA.length === 5 && teamB.length === 4) {
    return "11";//
  }
  
}