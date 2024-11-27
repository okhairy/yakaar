const User = require('../models/User');
const Collecte = require('../models/Collecte');
const jwt = require('jsonwebtoken');
const BlacklistToken = require('../models/blacklistToken');


// Fonction de validation des champs de l'utilisateur
const validateUserInput = (nom, prenom, email, motDePasse, codeSecret, telephone, sexe) => {
  const errors = [];

  // Validation du nom et prénom
  if (!nom || nom.trim() === '') {
    errors.push("Le nom est requis.");
  }
  if (!prenom || prenom.trim() === '') {
    errors.push("Le prénom est requis.");
  }

  // Validation de l'email
  const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
  if (!email || !emailRegex.test(email)) {
    errors.push("L'email est invalide.");
  }

  // Validation du mot de passe
  if (!motDePasse || motDePasse.length < 8) {
    errors.push("Le mot de passe doit contenir au moins 8 caractères.");
  }

  // Validation du code secret (doit être composé de 4 chiffres)
  const codeSecretRegex = /^\d{4}$/;
  if (!codeSecret || !codeSecretRegex.test(codeSecret)) {
    errors.push("Le code secret doit être composé de 4 chiffres.");
  }

  // Validation du téléphone : exactement 9 chiffres, aucun espace ni lettre
  const telephoneRegex = /^\d{9}$/;
  if (!telephone || !telephoneRegex.test(telephone)) {
    errors.push("Le numéro de téléphone doit contenir exactement 9 chiffres.");
  }

  // Validation du sexe
  if (!['Homme', 'Femme'].includes(sexe)) errors.push("Le sexe doit être 'Homme' ou 'Femme'.");

  return errors;
};


// Vérifier l'unicité de l'email
const checkEmailUnique = async (req, res) => {
  const { email } = req.query;

  try {
    const user = await User.findOne({ email: email });
    if (user) {
      return res.json({ result: false }); // L'email n'est pas unique
    }
    return res.json({ result: true }); // L'email est unique
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Une erreur est survenue.' });
  }
};

// Vérifier l'unicité du code secret
const checkCodeSecretUnique = async (req, res) => {
  const { codeSecret } = req.query;

  try {
    const user = await User.findOne({ codeSecret: codeSecret });
    if (user) {
      return res.json({ result: false }); // Le code secret n'est pas unique
    }
    return res.json({ result: true }); // Le code secret est unique
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Une erreur est survenue.' });
  }
};

// Vérifier l'unicité du téléphone
const checkTelephoneUnique = async (req, res) => {
  const { telephone } = req.query;

  try {
    const user = await User.findOne({ telephone: telephone });
    if (user) {
      return res.json({ result: false }); // Le téléphone n'est pas unique
    }
    return res.json({ result: true }); // Le téléphone est unique
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Une erreur est survenue.' });
  }
};

exports.inscrireUser = async (req, res) => {
  try {
    const { nom, prenom, email, motDePasse, codeSecret, role, telephone, sexe } = req.body;

    // Validation des champs
    const validationErrors = validateUserInput(nom, prenom, email, motDePasse, codeSecret, telephone, sexe);
    if (validationErrors.length > 0) {
      return res.status(400).json({ errors: validationErrors });
    }

    // Vérification de l'email
    const emailExists = await User.findOne({ email });
    if (emailExists) {
      return res.status(400).json({ error: 'L\'email existe déjà.' });
    }

    // Vérification du code secret
    const codeExists = await User.findOne({ codeSecret });
    if (codeExists) {
      return res.status(400).json({ error: 'Le code secret existe déjà.' });
    }

    // Vérification du téléphone
    const phoneExists = await User.findOne({ telephone });
    if (phoneExists) {
      return res.status(400).json({ error: 'Le numéro de téléphone existe déjà.' });
    }

    // Créer un nouvel utilisateur avec les informations reçues
    const newUser = new User({
      nom,
      prenom,
      email,
      motDePasse,
      codeSecret,
      role,
      telephone,
      sexe
    });

    await newUser.save();

    res.status(201).json({ message: 'Utilisateur inscrit avec succès', user: newUser });
  } catch (error) {
    console.error('Erreur dans inscrireUser:', error); // Log de l'erreur
    res.status(400).json({ error: 'Erreur lors de l\'inscription de l\'utilisateur' });
  }
};



exports.authentifier = async (req, res) => {
  try {
    const { email, motDePasse } = req.body;
    // Rechercher l'utilisateur par email
    const user = await User.findOne({ email });

    if (!user) {
      // L'email n'existe pas dans la base de données
      return res.status(401).json({ error: 'Email non trouvé. Veuillez vérifier votre email.' });
    }
   
    if (user.motDePasse !== motDePasse) {
      // L'email est correct mais le mot de passe est incorrect
      return res.status(401).json({ error: 'Mot de passe incorrect. Veuillez réessayer.' });
    }

    // Créer le token JWT
    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.status(200).json({
      message: 'Authentification réussie',
      token, // Renvoie le token au client
      user: {
        nom: user.nom,
        prenom: user.prenom,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de l\'authentification de l\'utilisateur' });
  }
};


// Authentification avec le code secret
exports.authentifierParCodeSecret = async (req, res) => {
  try {
    const { codeSecret } = req.body;

    // Vérifier si un utilisateur avec ce code secret existe
    const user = await User.findOne({ codeSecret });

    if (!user) {
      return res.status(401).json({ error: 'Code secret incorrect' });
    }

    // Générer un token JWT
    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.status(200).json({
      message: 'Authentification réussie',
      token,
      user: {
        nom: user.nom,
        prenom: user.prenom,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de l\'authentification par code secret' });
  }
};





//methode pour modifier un utilisateur en verifiant l'unicité du mail,telephone,code secret
exports.updateUser = async (req, res) => {
  try {
    const userId = req.params.id;
    const { nom, prenom, email, motDePasse, codeSecret, role, photo, telephone, sexe } = req.body;
 
    // Validation des champs de saisie
    const validationErrors = validateUserInput(nom, prenom, email, motDePasse, codeSecret, telephone, sexe);
    if (validationErrors.length > 0) {
      return res.status(400).json({ errors: validationErrors });
    }
 
    // Trouver l'utilisateur actuel
    const currentUser = await User.findById(userId);
    if (!currentUser) {
      return res.status(404).json({ error: 'Utilisateur non trouvé' });
    }
 
    // Vérifier l'unicité de l'email (en tenant compte de l'utilisateur actuel)
    const emailExists = await User.findOne({ 
      email: email 
    });
    if (emailExists && emailExists._id.toString() !== userId) {
      return res.status(400).json({ error: 'Cet email est déjà utilisé par un autre utilisateur' });
    }
 
    // Vérifier l'unicité du téléphone
    const telephoneExists = await User.findOne({ 
      telephone: telephone 
    });
    if (telephoneExists && telephoneExists._id.toString() !== userId) {
      return res.status(400).json({ error: 'Ce numéro de téléphone est déjà utilisé par un autre utilisateur' });
    }
 
    // Vérifier l'unicité du code secret
    const codeSecretExists = await User.findOne({ 
      codeSecret: codeSecret 
    });
    if (codeSecretExists && codeSecretExists._id.toString() !== userId) {
      return res.status(400).json({ error: 'Ce code secret est déjà utilisé par un autre utilisateur' });
    }
 
    // Mettre à jour l'utilisateur
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { nom, prenom, email, motDePasse, codeSecret, role, photo, telephone, sexe, dateModification: Date.now() },
      { new: true, runValidators: true }
    );
      
    res.status(200).json({
      message: 'Utilisateur mis à jour avec succès',
      user: updatedUser
    });
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la mise à jour de l\'utilisateur' });
  }
 };







exports.supprimerUser = async (req, res) => {
  try {
    const userId = req.params.id;

    // Supprimer l'utilisateur par son ID
    const deletedUser = await User.findByIdAndDelete(userId);

    if (!deletedUser) {
      return res.status(404).json({ error: 'Utilisateur non trouvé' });
    }

    
    res.status(200).json({ message: 'Utilisateur supprimé avec succès' });
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la suppression de l\'utilisateur' });
  }
};

// Suppression de plusieurs utilisateurs
exports.deleteMultipleUsers = async (req, res) => {
  try {
    const { userIds } = req.body; // Tableau des IDs des utilisateurs à supprimer

    // Vérification que `userIds` est fourni et non vide
    if (!userIds || !Array.isArray(userIds) || userIds.length === 0) {
      return res.status(400).json({ error: "Un tableau d'IDs valide est requis." });
    }

    // Suppression des utilisateurs dont les IDs sont dans `userIds`
    const result = await User.deleteMany({ _id: { $in: userIds } });

    // Réponse avec les détails des suppressions
    res.status(200).json({
      message: `${result.deletedCount} utilisateur(s) supprimé(s) avec succès.`,
    });
  } catch (error) {
    console.error('Erreur lors de la suppression de plusieurs utilisateurs :', error);
    res.status(500).json({ error: "Une erreur s'est produite lors de la suppression." });
  }
};

// Méthode pour récupérer tous les utilisateurs
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la récupération des utilisateurs' });
  }
};




// Méthode pour récupérer un utilisateur par ID
exports.getUserById = async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ error: 'Utilisateur non trouvé' });
    }

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la récupération de l\'utilisateur' });
  }
};

exports.activerDesactiverVentilateur = async (req, res) => {
  try {
    // Récupérer la dernière collecte pour basculer l'état du ventilateur
    const lastCollecte = await Collecte.findOne().sort({ date: -1 });

    if (!lastCollecte) {
      return res.status(404).json({ error: 'Aucune collecte trouvée' });
    }

    // Basculer l'état du ventilateur
    lastCollecte.ventilateur = !lastCollecte.ventilateur;
    await lastCollecte.save();

    res.status(200).json({
      message: `Ventilateur ${lastCollecte.ventilateur ? 'activé' : 'désactivé'} avec succès`,
      ventilateur: lastCollecte.ventilateur
    });
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors du changement d\'état du ventilateur' });
  }
};


 // Fonction pour gérer la déconnexion  
 exports.deconnexion = async (req, res) => {
  const token = req.headers['authorization'] && req.headers['authorization'].split(' ')[1]; // Récupérer le token

  if (token) {
    // Ajouter le token à la liste noire dans la base de données
    await BlacklistToken.create({ token });
    console.log(`Token ajouté à la liste noire : ${token}`);
  }

  res.status(200).json({ message: 'Déconnexion réussie' });
};

exports.changerRole = async (req, res) => {
  try {
    const {userId}  = req.params; // Récupérer l'ID de l'utilisateur à modifier
   
    const user = await User.findById(userId);
   
    
    if (!user) {
      return res.status(404).json({ error: 'Utilisateur non trouvé' });
    }

    // Vérifier le rôle actuel et le changer
    user.role = user.role === 'admin' ? 'simple' : 'admin';
    await user.save(); // Enregistrer les modifications
    console.log("succes")
    res.status(200).json({
      message: 'Rôle de l\'utilisateur mis à jour avec succès',
      user: { id: user._id, nom: user.nom, prenom: user.prenom, role: user.role }
    });
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la mise à jour du rôle de l\'utilisateur' });
  }

  module.exports = {
    checkEmailUnique,
    checkCodeSecretUnique,
    checkTelephoneUnique,
  };
  
};
