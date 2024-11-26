const express = require('express');
const router = express.Router();
const collecteController = require('../controllers/collecteController');

/**
 * @swagger
 * /api/collecte/creer:
 *   post:
 *     summary: Créer une nouvelle collecte
 *     tags: [Collecte]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               date:
 *                 type: string
 *                 format: date-time
 *                 description: Date et heure de la collecte
 *                 example: "2023-10-01T10:00:00Z"
 *               temperature:
 *                 type: number
 *                 description: Température enregistrée lors de la collecte
 *                 example: 22.5
 *               humidite:
 *                 type: number
 *                 description: Humidité enregistrée lors de la collecte
 *                 example: 60
 *               commentaire:
 *                 type: string
 *                 description: Commentaire facultatif sur la collecte
 *                 example: "Collecte du matin"
 *     responses:
 *       201:
 *         description: Collecte créée avec succès
 *       400:
 *         description: Requête invalide, par exemple si des données sont manquantes
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
 *           example: 1
 *       - in: query
 *         name: limit
 *         description: Nombre d'éléments par page
 *         required: false
 *         schema:
 *           type: integer
 *           example: 10
 *       - in: query
 *         name: startDate
 *         description: Date de début pour filtrer les collectes
 *         required: false
 *         schema:
 *           type: string
 *           format: date
 *           example: "2023-10-01"
 *       - in: query
 *         name: endDate
 *         description: Date de fin pour filtrer les collectes
 *         required: false
 *         schema:
 *           type: string
 *           format: date
 *           example: "2023-10-31"
 *     responses:
 *       200:
 *         description: Liste des collectes récupérée avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                     description: ID de la collecte
 *                   date:
 *                     type: string
 *                     format: date-time
 *                     description: Date et heure de la collecte
 *                   temperature:
 *                     type: number
 *                     description: Température enregistrée
 *                   humidite:
 *                     type: number
 *                     description: Humidité enregistrée
 *       400:
 *         description: Requête invalide
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
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   description: ID de la collecte
 *                 date:
 *                   type: string
 *                   format: date-time
 *                   description: Date et heure de la collecte
 *                 temperature:
 *                   type: number
 *                   description: Température enregistrée
 *                 humidite:
 *                   type: number
 *                   description: Humidité enregistrée
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
 *           example: "2023-10-01"
 *       - in: query
 *         name: endDate
 *         description: Date de fin pour filtrer les collectes
 *         required: true
 *         schema:
 *           type: string
 *           format: date
 *           example: "2023-10-31"
 *     responses:
 *       200:
 *         description: Liste des collectes récupérée par période
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                     description: ID de la collecte
 *                   date:
 *                     type: string
 *                     format: date-time
 *                     description: Date et heure de la collecte
 *                   temperature:
 *                     type: number
 *                     description: Température enregistrée
 *                   humidite:
 *                     type: number
 *                     description: Humidité enregistrée
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
 *           example: "2023-10-01"
 *     responses:
 *       200:
 *         description: Moyenne quotidienne trouvée
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 date:
 *                   type: string
 *                   format: date
 *                   description: Date de la moyenne
 *                 moyenneTemperature:
 *                   type: number
 *                   description: Moyenne des températures pour la date
 *                 moyenneHumidite:
 *                   type: number
 *                   description: Moyenne des humidités pour la date
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
 *           example: "2023-10-01"
 *     responses:
 *       200:
 *         description: Historique hebdomadaire trouvé
 *         content:
 *           application/json:
 *             type: array
 *             items:
 *               type: object
 *               properties:
 *                 date:
 *                   type: string
 *                   format: date
 *                   description: Date de la collecte
 *                 moyenneTemperature:
 *                   type: number
 *                   description: Moyenne des températures pour la journée
 *                 moyenneHumidite:
 *                   type: number
 *                   description: Moyenne des humidités pour la journée
 *       400:
 *         description: Requête invalide
 */
router.get('/historique-hebdomadaire', collecteController.getWeeklyHistory);

// Exemple: http://localhost:5000/api/collecte/historique-hebdomadaire?startDate=2023-11-10   (14)


module.exports = router;
