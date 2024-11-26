const Collecte = require('../models/collecte.model');
const moment = require('moment');
const cron = require('node-cron');
const fs = require('fs');
const path = require('path');

// Image en fonction de l'humidité
const getImageForHumidity = (humidity) => {
  if (humidity > 80) {
    return '/assets/high-img.png';
  } else if (humidity > 50) {
    return '/assets/medium-img.png';
  } else {
    return '/assets/low-img.png';
  }
};

// Ajouter une collecte de température et d'humidité
exports.addCollecte = async (req, res) => {
  const { temperature, humidite, ventilateur, time } = req.body;

  try {
    const newCollecte = new Collecte({ temperature, humidite, ventilateur, time });
    await newCollecte.save();

    // Ajouter l'image en fonction de l'humidité
    const image = getImageForHumidity(humidite);

    return res.status(201).json({
      message: 'Collecte ajoutée avec succès',
      collecte: newCollecte,
      image,
    });
  } catch (error) {
    return res.status(500).json({ message: 'Erreur lors de l\'ajout de la collecte', error: error.message });
  }
};

// Obtenir les données en temps réel
exports.getRealTimeData = async (req, res) => {
  try {
    const latestCollecte = await Collecte.findOne().sort({ time: -1 }).limit(1);
    if (!latestCollecte) {
      return res.status(404).json({ message: 'Aucune donnée en temps réel disponible' });
    }

    const image = getImageForHumidity(latestCollecte.humidite);
    return res.status(200).json({
      temperature: latestCollecte.température,
      humidite: latestCollecte.humidite,
      image,
    });
  } catch (error) {
    return res.status(500).json({ message: 'Erreur lors de la récupération des données en temps réel', error: error.message });
  }
};

// Obtenir l'historique des collectes de la semaine
exports.getWeeklyHistory = async (req, res) => {
  const startOfWeek = moment().startOf('week').toDate(); // Début de la semaine
  const endOfWeek = moment().endOf('week').toDate(); // Fin de la semaine

  try {
    const collectes = await Collecte.find({ date: { $gte: startOfWeek, $lte: endOfWeek } }).sort({ date: 1 });
    if (collectes.length === 0) {
      return res.status(404).json({ message: 'Aucune donnée pour cette semaine' });
    }

    return res.status(200).json({ collectes });
  } catch (error) {
    return res.status(500).json({ message: 'Erreur lors de la récupération de l\'historique de la semaine', error: error.message });
  }
};

// Obtenir la température moyenne de la journée
exports.getAverageTemperature = async (req, res) => {
  try {
    const collectes = await Collecte.aggregate([
      {
        $match: {
          date: {
            $gte: new Date(new Date().setHours(0, 0, 0, 0)), // Début de la journée
            $lte: new Date(new Date().setHours(23, 59, 59, 999)), // Fin de la journée
          },
        },
      },
      {
        $group: {
          _id: null,
          averageTemperature: { $avg: '$température' },
          averageHumidite: { $avg: '$humidite' },
        },
      },
    ]);

    if (collectes.length === 0) {
      return res.status(404).json({ message: 'Aucune donnée pour aujourd\'hui' });
    }

    return res.status(200).json({
      averageTemperature: collectes[0].averageTemperature,
      averageHumidite: collectes[0].averageHumidite,
    });
  } catch (error) {
    return res.status(500).json({ message: 'Erreur lors de la récupération de la température moyenne', error: error.message });
  }
};

// Obtenir les collectes horaires pour une date donnée
exports.getHourlyData = async (req, res) => {
  const { date } = req.query; // La date spécifiée par l'utilisateur (ex. '2024-11-20')

  if (!date) {
    return res.status(400).json({ message: 'La date est requise' });
  }

  try {
    const startOfDay = moment(date).startOf('day').toDate();
    const endOfDay = moment(date).endOf('day').toDate();

    const collectes = await Collecte.find({ date: { $gte: startOfDay, $lte: endOfDay } }).sort({ time: 1 });
    if (collectes.length === 0) {
      return res.status(404).json({ message: 'Aucune donnée pour la date spécifiée' });
    }

    return res.status(200).json({ collectes });
  } catch (error) {
    return res.status(500).json({ message: 'Erreur lors de la récupération des données horaires', error: error.message });
  }
};

// Planifier les collectes automatiques
cron.schedule('0 10,14,17 * * *', async () => {
  try {
    const temperature = (Math.random() * 30).toFixed(1); // Générer une température aléatoire pour exemple
    const humidite = (Math.random() * 100).toFixed(1); // Générer un taux d'humidité aléatoire
    const ventilateur = Math.random() < 0.5; // Générer l'état du ventilateur
    const time = new Date().toISOString();

    const collecte = new Collecte({
      temperature,
      humidite,
      ventilateur,
      time,
    });

    await collecte.save();
    console.log(`Collecte automatisée ajoutée à ${time}: Température = ${temperature}°C, Humidité = ${humidite}%`);

  } catch (error) {
    console.error('Erreur lors de la collecte automatisée:', error.message);
  }
});
