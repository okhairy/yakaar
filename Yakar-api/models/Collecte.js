const mongoose = require('mongoose');

const collecteSchema = new mongoose.Schema({
  date: { type: Date, default: Date.now }, // Date de la collecte
  time: { type: String, required: true },   // Heure de la collecte (ex: "10:00")
  température: { type: Number, required: true }, // Température enregistrée
  humidite: { type: Number, required: true },     // Humidité enregistrée
  ventilateur: { type: Boolean, default: false }  // État du ventilateur
});

module.exports = mongoose.model('Collecte', collecteSchema);
