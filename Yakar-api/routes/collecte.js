const express = require('express');
const router = express.Router();
const collecteController = require('../controllers/collecteController');

/**
 * @swagger
 * /api/collecte/creer:
 *   post:
 *     summary: Créer une nouvelle collecte
 *     tags: [Collecte]
 *     responses:
 *       201:
 *         description: Collecte créée avec succès
 *       400:
 *         description: Requête invalide
 */
router.post('/creer', collecteController.creerCollecte);

/**
 * @swagger
 * /api/collecte/get-all:
 *   get:
 *     summary: Récupérer toutes les collectes
 *     tags: [Collecte]
 *     parameters:
 *       - in: query
 *         name: page
 *         description: Numéro de page pour la pagination
 *         required: false
 *         schema:
 *           type: integer
 *       - in: query
 *         name: limit
 *         description: Nombre d'éléments par page
 *         required: false
 *         schema:
 *           type: integer
 *       - in: query
 *         name: startDate
 *         description: Date de début pour filtrer les collectes
 *         required: false
 *         schema:
 *           type: string
 *           format: date
 *       - in: query
 *         name: endDate
 *         description: Date de fin pour filtrer les collectes
 *         required: false
 *         schema:
 *           type: string
 *           format: date
 *     responses:
 *       200:
 *         description: Liste des collectes récupérée avec succès
 */
router.get('/get-all', collecteController.getAllCollectes);

// Exemple: http://localhost:5000/api/collecte/get-all?page=2&limit=5
//http://localhost:5000/api/collecte/get-all?startDate=2023-11-01&endDate=2023-11-30&page=1&limit=5


/**
 * @swagger
 * /api/collecte/get/{id}:
 *   get:
 *     summary: Récupérer une collecte par ID
 *     tags: [Collecte]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID de la collecte à récupérer
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Collecte trouvée
 *       404:
 *         description: Collecte non trouvée
 */
router.get('/get/:id', collecteController.getCollecteById);

/**
 * @swagger
 * /api/collecte/periode:
 *   get:
 *     summary: Récupérer les collectes par période
 *     tags: [Collecte]
 *     parameters:
 *       - in: query
 *         name: startDate
 *         description: Date de début pour filtrer les collectes
 *         required: true
 *         schema:
 *           type: string
 *           format: date
 *       - in: query
 *         name: endDate
 *         description: Date de fin pour filtrer les collectes
 *         required: true
 *         schema:
 *           type: string
 *           format: date
 *     responses:
 *       200:
 *         description: Liste des collectes récupérée par période
 *       400:
 *         description: Requête invalide
 */
router.get('/periode', collecteController.getCollectesByDate);

// Exemple: http://localhost:5000/api/collecte/periode?startDate=2023-11-01&endDate=2023-11-30


/**
 * @swagger
 * /api/collecte/moyenne-journaliere:
 *   get:
 *     summary: Obtenir la moyenne quotidienne
 *     tags: [Collecte]
 *     parameters:
 *       - in: query
 *         name: date
 *         description: Date pour laquelle obtenir la moyenne
 *         required: true
 *         schema:
 *           type: string
 *           format: date
 *     responses:
 *       200:
 *         description: Moyenne quotidienne trouvée
 *       404:
 *         description: Aucune collecte trouvée pour cette date
 */
router.get('/moyenne-journaliere', collecteController.getDailyAverage);

// Exemple: http://localhost:5000/api/collecte/moyenne-journaliere?date=2023-11-10


/**
 * @swagger
 * /api/collecte/historique-hebdomadaire:
 *   get:
 *     summary: Obtenir l'historique hebdomadaire
 *     tags: [Collecte]
 *     parameters:
 *       - in: query
 *         name: startDate
 *         description: Date de début pour l'historique
 *         required: true
 *         schema:
 *           type: string
 *           format: date
 *     responses:
 *       200:
 *         description: Historique hebdomadaire trouvé
 *       400:
 *         description: Requête invalide
 */
router.get('/historique-hebdomadaire', collecteController.getWeeklyHistory);

// Exemple: http://localhost:5000/api/collecte/historique-hebdomadaire?startDate=2023-11-10


module.exports = router;
