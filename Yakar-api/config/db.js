const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Charger les variables d'environnement depuis le fichier .env
dotenv.config();

// Fonction pour connecter MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log("MongoDB est connecté !");
  } catch (error) {
    console.error("Erreur de connexion MongoDB:", error.message);
    process.exit(1); // Arrêter l'application si la connexion échoue
  }
};

module.exports = connectDB;
