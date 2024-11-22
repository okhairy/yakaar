const jwt = require('jsonwebtoken');
const BlacklistToken = require('../models/blacklistToken');

 
// Middleware pour vérifier le token
exports.verifyToken = async (req, res, next) => {
  const token = req.headers['authorization'] && req.headers['authorization'].split(' ')[1]; // Format : "Bearer TOKEN"

  // Vérifier si un token est présent
  if (!token) {
    return res.status(403).json({ error: 'Un token est requis pour accéder à cette ressource' });
  }

  // Vérifiez si le token est dans la liste noire
  const blacklisted = await BlacklistToken.findOne({ token });
  if (blacklisted) {
    return res.status(401).json({ error: 'Token invalide (déconnecté)' });
  }

  try {
    // Vérifier et décoder le token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Attacher les données de l'utilisateur à la requête
    next(); // Passer au middleware suivant ou à la route
  } catch (error) {
    return res.status(401).json({ error: 'Token invalide ou expiré' });
  }
};

// Middleware pour vérifier le rôle de l'utilisateur
exports.verifyRole = (role) => {
  return (req, res, next) => {
    // Vérifier si le rôle de l'utilisateur correspond au rôle requis
    if (req.user.role !== role) {
      return res.status(403).json({ error: 'Accès refusé : vous n\'avez pas les autorisations nécessaires' });
    }
    next(); // Passer au middleware suivant ou à la route
  };
};
