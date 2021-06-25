const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define collection and schema for users
let User = new Schema({
  nom: {
    type: String
  },
  ville: {
    type: String
  },
  adresse: {
    type: String
  }
},{
    collection: 'users'
});

module.exports = mongoose.model('Users', User);