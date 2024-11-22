const express = require('express');
const router = express.Router();
const collecteController = require('../controllers/collecteController');

/**
 * @swagger
 * /api/collecte/creer:
 *   post:
 *     summary: Créer une nouvelle collecte
 *     tags: [Collecte]
<<<<<<< HEAD
=======
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
>>>>>>> aaf84928c5979742508d4548159d7b1b6f39512d
 *     responses:
 *       201:
 *         description: Collecte créée avec succès
 *       400:
<<<<<<< HEAD
 *         description: Requête invalide
=======
 *         description: Requête invalide, par exemple si des données sont manquantes
>>>>>>> aaf84928c5979742508d4548159d7b1b6f39512d
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
<<<<<<< HEAD
=======
 *           example: 1
>>>>>>> aaf84928c5979742508d4548159d7b1b6f39512d
 *       - in: query
 *         name: limit
 *         description: Nombre d'éléments par page
 *         required: false
 *         schema:
 *           type: integer
<<<<<<< HEAD
=======
 *           example: 10
>>>>>>> aaf84928c5979742508d4548159d7b1b6f39512d
 *       - in: query
 *         name: startDate
 *         description: Date de début pour filtrer les collectes
 *         required: false
 *         schema:
 *           type: string
 *           format: date
<<<<<<< HEAD
=======
 *           example: "2023-10-01"
>>>>>>> aaf84928c5979742508d4548159d7b1b6f39512d
 *       - in: query
 *         name: endDate
 *         description: Date de fin pour filtrer les collectes
 *         required: false
 *         schema:
 *           type: string
 *           format: date
<<<<<<< HEAD
 *     responses:
 *       200:
 *         description: Liste des collectes récupérée avec succès
=======
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
>>>>>>> aaf84928c5979742508d4548159d7b1b6f39512d
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
<<<<<<< HEAD
=======
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
>>>>>>> aaf84928c5979742508d4548159d7b1b6f39512d
 *       404:
 *         description: Collecte non trouvée
 */
router.get('/get/:id', collecteController.getCollecteById);

<<<<<<< HEAD
=======

>>>>>>> aaf84928c5979742508d4548159d7b1b6f39512d
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
<<<<<<< HEAD
=======
 *           example: "2023-10-01"
>>>>>>> aaf84928c5979742508d4548159d7b1b6f39512d
 *       - in: query
 *         name: endDate
 *         description: Date de fin pour filtrer les collectes
 *         required: true
 *         schema:
 *           type: string
 *           format: date
<<<<<<< HEAD
 *     responses:
 *       200:
 *         description: Liste des collectes récupérée par période
=======
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
>>>>>>> aaf84928c5979742508d4548159d7b1b6f39512d
 *       400:
 *         description: Requête invalide
 */
router.get('/periode', collecteController.getCollectesByDate);
<<<<<<< HEAD

=======
>>>>>>> aaf84928c5979742508d4548159d7b1b6f39512d
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
<<<<<<< HEAD
 *     responses:
 *       200:
 *         description: Moyenne quotidienne trouvée
=======
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
>>>>>>> aaf84928c5979742508d4548159d7b1b6f39512d
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
<<<<<<< HEAD
 *     responses:
 *       200:
 *         description: Historique hebdomadaire trouvé
=======
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
>>>>>>> aaf84928c5979742508d4548159d7b1b6f39512d
 *       400:
 *         description: Requête invalide
 */
router.get('/historique-hebdomadaire', collecteController.getWeeklyHistory);

<<<<<<< HEAD
// Exemple: http://localhost:5000/api/collecte/historique-hebdomadaire?startDate=2023-11-10
=======
// Exemple: http://localhost:5000/api/collecte/historique-hebdomadaire?startDate=2023-11-10   (14)
>>>>>>> aaf84928c5979742508d4548159d7b1b6f39512d


module.exports = router;
