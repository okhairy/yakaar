const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const port = 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Connecter à MongoDB (remplace par ta propre URI)
mongoose.connect('mongodb://localhost:27017/authentication', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.log('MongoDB connection error:', err));

// Définir le modèle MongoDB pour le code secret
const SecretCodeSchema = new mongoose.Schema({
  code: { type: String, required: true },
});

const SecretCode = mongoose.model('SecretCode', SecretCodeSchema);

// Route POST pour l'authentification avec le code secret
app.post('/api/login', async (req, res) => {
  const { secretCode } = req.body;

  // Validation du code secret
  if (!secretCode || !/^\d{4}$/.test(secretCode)) {
    return res.status(400).json({ message: 'Code secret invalide. Il doit être un nombre à 4 chiffres.' });
  }

  // Chercher le code secret dans la base de données
  const storedCode = await SecretCode.findOne({ code: secretCode });

  if (storedCode) {
    return res.status(200).json({ message: 'Connexion réussie' });
  }

  return res.status(401).json({ message: 'Code secret incorrect' });
});

// Démarrer le serveur
app.listen(port, () => {
  console.log(`Server running on http://localhost:${5000}`);
});
