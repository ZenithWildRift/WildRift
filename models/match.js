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
    timer: {
      type: Boolean,
      default: 0
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
        url: {
          type: String
        },
        public_id: {
          type: String
        }
      },
    },

    teamB: {
      name: {
        type: String,
      },
      image: {
        url: {
          type: String
        },
        public_id: {
          type: String
        }
      },
    },

    organisation: {
      name: {
        type: String,
      },
      image: {
        url: {
          type: String
        },
        public_id: {
          type: String
        }
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
      backgroundImage: {
        url: {
          type: String
        },
        public_id: {
          type: String
        }
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

    author: {type: mongoose.Schema.Types.ObjectId, ref: 'User' },

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
