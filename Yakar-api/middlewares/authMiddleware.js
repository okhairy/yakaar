const jwt = require('jsonwebtoken');
<<<<<<< HEAD

// Middleware pour vérifier le token et le rôle
exports.verifyToken = (req, res, next) => {
  const token = req.headers['authorization'];

=======
const BlacklistToken = require('../models/blacklistToken');

 
// Middleware pour vérifier le token
exports.verifyToken = async (req, res, next) => {
  const token = req.headers['authorization'] && req.headers['authorization'].split(' ')[1]; // Format : "Bearer TOKEN"

  // Vérifier si un token est présent
>>>>>>> aaf84928c5979742508d4548159d7b1b6f39512d
  if (!token) {
    return res.status(403).json({ error: 'Un token est requis pour accéder à cette ressource' });
  }

<<<<<<< HEAD
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Décode le token et attache les données de l'utilisateur à la requête
    next();
=======
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
>>>>>>> aaf84928c5979742508d4548159d7b1b6f39512d
  } catch (error) {
    return res.status(401).json({ error: 'Token invalide ou expiré' });
  }
};

<<<<<<< HEAD
exports.verifyRole = (role) => {
  return (req, res, next) => {
    if (req.user.role !== role) {
      return res.status(403).json({ error: 'Accès refusé : vous n\'avez pas les autorisations nécessaires' });
    }
    next();
  };
};
=======
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
>>>>>>> aaf84928c5979742508d4548159d7b1b6f39512d
