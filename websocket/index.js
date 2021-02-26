const Match = require("../models/match");
const { readyCheck, SelectCharacter } = require("./helper");

const io = require('socket.io')(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

io.on('connection', socket => {
  console.log("connected");

  socket.on("join", (data) => {
    console.log(`JOining ${data.match_id}`)

    socket.join(data.match_id);
    socket.match_id = data.match_id;

    socket.on('readyCheck', team_id => readyCheck(team_id, socket))
  
    //data include - character, team_id
    socket.on('select_character', data => SelectCharacter(data.character, data.team_id, socket));
  
  })
})