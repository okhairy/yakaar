// models/blacklistToken.js
const mongoose = require('mongoose');

const BlacklistTokenSchema = new mongoose.Schema({
  token: { type: String, required: true },
  createdAt: { type: Date, expires: '1h', default: Date.now } // Le token expirera après 1 heure
});

const BlacklistToken = mongoose.model('BlacklistToken', BlacklistTokenSchema);

module.exports = BlacklistToken;