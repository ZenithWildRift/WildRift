var mongoose = require("mongoose");
const crypto = require('crypto');
const uuidv1 =  require('uuid');

var userSchema =  new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },

  email: {
    type:String, 
    required: true,
    trim: true,
    unique: true,
    lowercase: true,
  },

  image: String,

  phone: {
    type: String,
    trim: true,
  },
  
  //SuperAdmin
  admin: {
    type: Boolean,
    default: 0,
  },

  //Normal Access Staff
  staff: {
    type: Boolean,
    default: 0,
  },
  
  salt:  String,

  createdAt: {
    type: Date,
    default: Date.now()
  }

},
  {timestamps: true}
);

//Encrypt password with crypto

userSchema
  .virtual("password")
  .set((password) => {
    this._password = password;
    this.salt = uuidv1();
    this.encry_password = this.securePassword(password);
  })
  .get(() => {
    return this._password;
  });

  userSchema.methods = {
    authenticate: function(plainpassword) {
      return this.securePassword(plainpassword);
    },

    //Get hashed password
    securePassword:  function(plainpassword){
      if(!plainpassword) return "";
      try {
        return crypto.createHmac('sha256', this.salt)
                      .update(plainpassword)
                      .digest('hex');
      } catch(err) {
        return console.log("Error in generating password");
      }
    }
  }

  module.exports = mongoose.model("User", userSchema);