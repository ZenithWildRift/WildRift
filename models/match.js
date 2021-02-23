  var mongoose = require("mongoose");

var matchSchema =  new mongoose.Schema({
  name: {
    type: String,
  },
  
  checkTeamA: {
    type: Boolean,
    default: 0
  },

  checkTeamB: {
    type: Boolean,
    default: 0
  },

  teamA: {
    name: {
      type: String,
    },
    image: {
      data: Buffer,
      contentType: String
    },
  },

  teamB: {
    name: {
      type: String,
    },
    image: {
      data: Buffer,
      contentType: String
    },
  },

  organisation: {
    name: {
      type: String,
    },
    image: {
    data: Buffer,
    contentType: String
    }
  },

  links: {
    teamA: {
      type: String,
    },
    teamB: {
      type: String,
    },
    organisation: {
      type: String,
    },
  },

  template: {
    header: {
      type: String,
    },
    background: {
      type: String,
    },
    teamA : {
      type: String,
    },
    teamB : {
      type: String,
    }
  },

  bannedList: {
    types: Array,
  },

  bannedCharaters: {
    teamA: [],
    teamB: [],
  },

  SelectedCharacters: {
    teamA: [],
    teamB: []
  },

  createdAt: {
    type:Date,
    default: Date.now()
  },

},
  {timestamps: true}
)

module.exports = mongoose.model("Match", matchSchema);