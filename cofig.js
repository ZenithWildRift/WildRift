var cloudinary = require('cloudinary').v2;

module.exports = {
  URL: "http://localhost:3000/match",
}

cloudinary.config({ 
  cloud_name: 'nakul-londhe', 
  api_key: '612196374186139', 
  api_secret: 'Bvtku5MBb4q85vIfma8aJMBNNZc' 
});