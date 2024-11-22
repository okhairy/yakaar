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
 *     responses:
 *       200:
 *         description: Authentification réussie
 *       401:
 *         description: Authentification échouée
 */
router.post('/authentifier', userController.authentifier);

/**
 * @swagger
 * /api/user/authentifier/code-secret:
 *   post:
 *     summary: Authentifier un utilisateur avec un code secret
 *     tags: [User]
 *     responses:
 *       200:
 *         description: Authentification réussie avec code secret
 *       401:
 *         description: Authentification échouée
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
 *     responses:
 *       201:
 *         description: Utilisateur inscrit avec succès
 *       403:
 *         description: Accès interdit
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
 *     responses:
 *       200:
 *         description: État du ventilateur mis à jour
 *       403:
 *         description: Accès interdit
 */
router.put('/ventilateur', verifyToken, verifyRole('admin'), userController.activerDesactiverVentilateur);


module.exports = router;
