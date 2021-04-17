const Match = require("../models/match");
const { readyCheck, SelectCharacter } = require("./helper");
const { default: switchCounter } = require("./switchCounter");

const io = require('socket.io')(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

io.on('connection', socket => {
  timerOn = false;
  totalCount = 1000;
  counter = 30;
  
  socket.on("join", (data) => {
    console.log(`JOining ${data.match_id}`)

    socket.join(data.match_id);
    socket.match_id = data.match_id;

    // Callback to change socket variable
    socket.on('readyCheck', team_id => readyCheck(team_id, socket, () => {
      timerOn = true;console.log("runnning")
    }))
    
    //data include - character, team_id
    socket.on('select_character', data => SelectCharacter(data.character, data.index, data.team_id, socket));
  
// console.log({timerOn})
//     if(socket.timerOn) {
//       console.log("Cahl rha h")
//       setInterval(() => {
//         counter -= 1000;
//         socket.nsp.to(socket.match_id).emit("timer_count", {counter : counter});
//       }, totalCount);
//     }

    socket.on('start_timer', () => {
      console.log("kuchh ho bhai")
      setInterval(() => {
        counter -= 1;
        console.log(counter);
        socket.nsp.to(socket.match_id).emit("timer_count", {counter : counter});
      }, totalCount);
    })

  })
})