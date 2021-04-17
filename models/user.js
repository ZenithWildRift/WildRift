var mongoose = require("mongoose");
const crypto = require('crypto');
const uuidv1 =  require('uuid').v1;

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

  // SuperAdmin
  admin: {
    type: Boolean,
    default: 0,
  },

  // Normal Access Staff
  staff: {
    type: Boolean,
    default: 0,
  },

  // Organisation Access
  organisation: {
    type: Boolean,
    default: 0
  },
  
  organisation_name: {
    type: String,
  },

  encry_password :{
    type:String,
    required: true
  },
  
  salt: String,

  createdAt: {
    type: Date,
    default: Date.now()
  }

},
  {timestamps: true}
);

// Encrypyting with crypto
userSchema
  .virtual("password")
  .set(function (password) {
    this._password = password;
    this.salt = uuidv1();
    this.encry_password = this.securePassword(password);
  })
  .get(function () {
    return this._password;
  });

userSchema.methods = {
  authenticate: function (plainpassword) {
    return this.securePassword(plainpassword) === this.encry_password;
  },
  //from Node Crypto
  securePassword: function (plainpassword) {
    if (!plainpassword) return "";
    try {
      return (
        crypto
          .createHmac("sha256", this.salt)
          //Instead of returning we can also save the values in a variable
          .update(plainpassword)
          .digest("hex")
      );
    } catch (err) {
      return "";
    }
  },
};

module.exports = mongoose.model("User", userSchema);
