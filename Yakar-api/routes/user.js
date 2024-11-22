const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { verifyToken, verifyRole } = require('../middlewares/authMiddleware');

/**
 * @swagger
 * /api/user/authentifier:
 *   post:
 *     summary: Authentifier un utilisateur
 *     tags: [User]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: Adresse email de l'utilisateur
 *                 example: "utilisateur@ example.com"
 *               motDePasse:
 *                 type: string
 *                 description: Mot de passe de l'utilisateur
 *                 example: "motdepasse123"
 *     responses:
 *       200:
 *         description: Authentification réussie
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                   description: Token JWT pour les futures requêtes
 *       401:
 *         description: Authentification échouée, informations d'identification incorrectes
 */
router.post('/authentifier', userController.authentifier);

/**
 * @swagger
 * /api/user/authentifier/code-secret:
 *   post:
 *     summary: Authentifier un utilisateur avec un code secret
 *     tags: [User]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: Adresse email de l'utilisateur
 *                 example: "utilisateur@ example.com"
 *               codeSecret:
 *                 type: string
 *                 description: Code secret pour l'authentification
 *                 example: "123456"
 *     responses:
 *       200:
 *         description: Authentification réussie avec code secret
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                   description: Token JWT pour les futures requêtes
 *       401:
 *         description: Authentification échouée, code secret incorrect
 */
router.post('/authentifier/code-secret', userController.authentifierParCodeSecret);
// http://localhost:5000/api/user/authentifier/code-secret


// Routes protégées (requiert un token)


/**
 * @swagger
 * /api/user/inscrire:
 *   post:
 *     summary: Inscrire un nouvel utilisateur
 *     tags: [User]
 *     security:
 *       - Bearer: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: Adresse email de l'utilisateur
 *                 example: "nouvelutilisateur@ example.com"
 *               motDePasse:
 *                 type: string
 *                 description: Mot de passe de l'utilisateur
 *                 example: "motdepasse123"
 *               role:
 *                 type: string
 *                  description: "Rôle de l'utilisateur (ex: admin, utilisateur)"

 *                 example: "utilisateur"
 *     responses:
 *       201:
 *         description: Utilisateur inscrit avec succès
 *       403:
 *         description: Accès interdit, l'utilisateur ne peut pas s'inscrire
 */
router.post('/inscrire', verifyToken, verifyRole('admin'), userController.inscrireUser);


/**
 * @swagger
 * /api/user/update/{id}:
 *   put:
 *     summary: Mettre à jour un utilisateur par ID
 *     tags: [User]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID de l'utilisateur à mettre à jour
 *         schema:
 *           type: string
 *     security:
 *       - Bearer: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: Nouvelle adresse email de l'utilisateur
 *                 example: "utilisateurMiseAJour@ example.com"
 *               role:
 *                 type: string
 *                 description: Nouveau rôle de l'utilisateur
 *                 example: "admin"
 *     responses:
 *       200:
 *         description: Utilisateur mis à jour avec succès
 *       403:
 *         description: Accès interdit
 *       404:
 *         description: Utilisateur non trouvé
 */
router.put('/update/:id', verifyToken, verifyRole('admin'), userController.updateUser);

/**
 * @swagger
 * /api/user/supprimer/{id}:
 *   delete:
 *     summary: Supprimer un utilisateur par ID
 *     tags: [User]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID de l'utilisateur à supprimer
 *         schema:
 *           type: string
 *     security:
 *       - Bearer: []
 *     responses:
 *       204:
 *         description: Utilisateur supprimé avec succès
 *       403:
 *         description: Accès interdit
 *       404:
 *         description: Utilisateur non trouvé
 */
router.delete('/supprimer/:id', verifyToken, verifyRole('admin'), userController.supprimerUser);

/**
 * @swagger
 * /api/user/get-all:
 *   get:
 *     summary: Récupérer tous les utilisateurs
 *     tags: [User]
 *     security:
 *       - Bearer: []
 *     responses:
 *       200:
 *         description: Liste des utilisateurs
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                     description: ID de l'utilisateur
 *                   email:
 *                     type: string
 *                     description: Adresse email de l'utilisateur
 *                   role:
 *                     type: string
 *                     description: Rôle de l'utilisateur
 *       403:
 *         description: Accès interdit
 */
router.get('/get-all', verifyToken, verifyRole('admin'), userController.getAllUsers);

/**
 * @swagger
 * /api/user/get/{id}:
 *   get:
 *     summary: Récupérer un utilisateur par ID
 *     tags: [User]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID de l'utilisateur à récupérer
 *         schema:
 *           type: string
 *     security:
 *       - Bearer: []
 *     responses:
 *       200:
 *         description: Utilisateur trouvé
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   description: ID de l'utilisateur
 *                 email:
 *                   type: string
 *                   description: Adresse email de l'utilisateur
 *                 role:
 *                   type: string
 *                   description: Rôle de l'utilisateur
 *       404:
 *         description: Utilisateur non trouvé
 */
router.get('/get/:id', verifyToken, userController.getUserById);

/**
 * @swagger
 * /api/user/ventilateur:
 *   put:
 *     summary: Activer ou désactiver le ventilateur
 *     tags: [User]
 *     security:
 *       - Bearer: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               etat:
 *                 type: boolean
 *                 description: État du ventilateur, true pour activer, false pour désactiver
 *                 example: true
 *     responses:
 *       200:
 *         description: État du ventilateur mis à jour
 *       403:
 *         description: Accès interdit
 */
router.put('/ventilateur', verifyToken, verifyRole('admin'), userController.activerDesactiverVentilateur);



/**
 * @swagger
 * /api/user/deconnexion:
 *   post:
 *     summary: Déconnexion d'un utilisateur
 *     tags: [User]
 *     security:
 *       - Bearer: []
 *     responses:
 *       200:
 *         description: Déconnexion réussie
 *       401:
 *         description: Token invalide ou expiré
 *       403:
 *         description: Un token est requis pour accéder à cette ressource
 */
router.post('/deconnexion', userController.deconnexion);


/**
 * @swagger
 * /api/user/changer-role/{userId}:
 *   patch:
 *     summary: Changer le rôle d'un utilisateur
 *     tags: [User]
 *     security:
 *       - Bearer: []
 *     parameters:
 *       - name: userId
 *         in: path
 *         required: true
 *         description: ID de l'utilisateur dont le rôle doit être changé
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               role:
 *                 type: string
 *                 description: Nouveau rôle à assigner à l'utilisateur
 *                 example: "admin"
 *     responses:
 *       200:
 *         description: Rôle changé avec succès
 *       400:
 *         description: Requête invalide, par exemple si le rôle n'est pas spécifié
 *       401:
 *         description: Token invalide ou expiré
 *       403:
 *         description: Un token est requis pour accéder à cette ressource
 */
router.patch('/changer-role/:userId', verifyToken, verifyRole('admin'), userController.changerRole); 

/**
 * @swagger
 * /api/user/delete-multiple:
 *   delete:
 *     summary: Suppression de plusieurs utilisateurs
 *     tags: [User]
 *     security:
 *       - Bearer: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userIds:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: Liste des IDs des utilisateurs à supprimer
 *                 example: ["userId1", "userId2", "userId3"]
 *     responses:
 *       200:
 *         description: Utilisateurs supprimés avec succès
 *       400:
 *         description: Requête invalide, par exemple si aucune ID n'est fournie
 *       401:
 *         description: Token invalide ou expiré
 *       403:
 *         description: Un token est requis pour accéder à cette ressource
 */
router.delete('/delete-multiple', verifyToken, verifyRole('admin'), userController.deleteMultipleUsers); 



module.exports = router;
