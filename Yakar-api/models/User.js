const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  nom: { type: String, required: true },
  prenom: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  motDePasse: { type: String, required: true },
  codeSecret: { type: Number, required: true, unique: true },
  role: { type: String, enum: ['admin', 'simple'], default: 'simple' },
  photo: { type: String },
  dateCreation: { type: Date, default: Date.now },
  dateModification: { type: Date, default: Date.now },
  telephone: { type: String, required: true, unique: true },  
  sexe: { type: String, enum: ['Homme', 'Femme'], required: true }  
});

module.exports = mongoose.model('User', userSchema);
