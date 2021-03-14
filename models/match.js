var mongoose = require("mongoose");

var matchSchema = new mongoose.Schema(
  {
    name: {
      type: String,
    },

    ready: {
      type: Boolean,
      default: 0,
    },

    checkTeamA: {
      type: Boolean,
      default: 0,
    },

    checkTeamB: {
      type: Boolean,
      default: 0,
    },

    teamA: {
      name: {
        type: String,
      },
      image: {
        type: String,
      },
    },

    teamB: {
      name: {
        type: String,
      },
      image: {
        type: String,
      },
    },

    organisation: {
      name: {
        type: String,
      },
      image: {
        type: String,
      },
    },

    turn: {
      type: String,
      default: "",
    },

    template: {
      background: {
        type: String,
      },
      teamA: {
        type: String,
      },
      teamB: {
        type: String,
      },
      textColor: {
        type: String
      },
      selectionBox: {
        type: String
      },
    },

    bannedList: {
      type: Array,
    },

    completed: {
      type: Boolean,
      default: 0,
    },

    bannedCharaters: {
      teamA: [],
      teamB: [],
    },

    selectedCharacters: {
      teamA: [],
      teamB: [],
    },

    createdAt: {
      type: Date,
      default: Date.now(),
    },

  },
  { timestamps: true }
);

module.exports = mongoose.model("Match", matchSchema);
