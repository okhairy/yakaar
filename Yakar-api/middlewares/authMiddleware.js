const jwt = require('jsonwebtoken');

// Middleware pour vérifier le token et le rôle
exports.verifyToken = (req, res, next) => {
  const token = req.headers['authorization'];

  if (!token) {
    return res.status(403).json({ error: 'Un token est requis pour accéder à cette ressource' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Décode le token et attache les données de l'utilisateur à la requête
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Token invalide ou expiré' });
  }
};

exports.verifyRole = (role) => {
  return (req, res, next) => {
    if (req.user.role !== role) {
      return res.status(403).json({ error: 'Accès refusé : vous n\'avez pas les autorisations nécessaires' });
    }
    next();
  };
};
