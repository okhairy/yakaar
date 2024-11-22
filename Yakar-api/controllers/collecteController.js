const Collecte = require('../models/Collecte');

// Créer une nouvelle collecte
exports.creerCollecte = async (req, res) => {
  try {
    const { time, température, humidite, ventilateur } = req.body;

    const nouvelleCollecte = new Collecte({
      time,
      température,
      humidite,
      ventilateur
    });

    await nouvelleCollecte.save();
    res.status(201).json({ message: 'Collecte créée avec succès', collecte: nouvelleCollecte });
  } catch (error) {
    res.status(400).json({ error: 'Erreur lors de la création de la collecte' });
  }
};

// Récupérer toutes les collectes
exports.getAllCollectes = async (req, res) => {
  try {
    // Récupérer les paramètres de pagination et de filtrage
    const { page = 1, limit = 5, startDate, endDate } = req.query;

    // Construire les filtres dynamiques uniquement pour la plage de dates
    const filters = {};
    if (startDate && endDate) {
      filters.date = { $gte: new Date(startDate), $lte: new Date(endDate) };
    }

    // Pagination
    const skip = (page - 1) * limit;
    const collectes = await Collecte.find(filters)
      .sort({ date: -1 }) // Trier par date décroissante
      .skip(skip)
      .limit(parseInt(limit));

    // Compter le total des résultats
    const total = await Collecte.countDocuments(filters);

    res.status(200).json({
      page: parseInt(page),
      totalPages: Math.ceil(total / limit),
      totalResults: total,
      results: collectes
    });
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la récupération des collectes' });
  }
};


// Récupérer une collecte par ID
exports.getCollecteById = async (req, res) => {
  try {
    const collecteId = req.params.id;
    const collecte = await Collecte.findById(collecteId);

    if (!collecte) {
      return res.status(404).json({ error: 'Collecte non trouvée' });
    }

    res.status(200).json(collecte);
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la récupération de la collecte' });
  }
};

// Récupérer les collectes d’une période spécifique (exemple : journée, semaine)
exports.getCollectesByDate = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    // Filtrer les collectes entre deux dates
    const collectes = await Collecte.find({
      date: { $gte: new Date(startDate), $lte: new Date(endDate) }
    });

    res.status(200).json(collectes);
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la récupération des collectes pour la période donnée' });
  }
};


// La méthode vérifie que les collectes de 10:00, 14:00, et 17:00 sont présentes pour la date fournie.
// Si une des collectes manque, elle renvoie un message indiquant que les données sont incomplètes pour calculer la moyenne.
// Si toutes les heures sont présentes, elle calcule les moyennes.
exports.getDailyAverage = async (req, res) => {
  try {
    const { date } = req.query;

    // Filtrer les collectes de la date spécifiée avec les heures précises
    const collectes = await Collecte.find({
      date: {
        $gte: new Date(date).setHours(0, 0, 0, 0),
        $lte: new Date(date).setHours(23, 59, 59, 999)
      },
      time: { $in: ["10:00", "14:00", "17:00"] }
    });

    // Vérifier si les collectes pour les trois heures sont présentes
    const requiredTimes = ["10:00", "14:00", "17:00"];
    const collecteTimes = collectes.map(collecte => collecte.time);
    const hasAllTimes = requiredTimes.every(time => collecteTimes.includes(time));

    if (!hasAllTimes) {
      return res.status(404).json({ message: 'Données incomplètes pour cette date. Impossible de calculer la moyenne.' });
    }

    // Calculer les moyennes si toutes les heures sont présentes
    const totalTemp = collectes.reduce((sum, collecte) => sum + collecte.température, 0);
    const totalHum = collectes.reduce((sum, collecte) => sum + collecte.humidite, 0);
    const moyenneTemp = totalTemp / collectes.length;
    const moyenneHum = totalHum / collectes.length;

    res.status(200).json({
      date,
      moyenneTemp,
      moyenneHum
    });
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors du calcul des moyennes journalières' });
  }
};


// La méthode vérifie pour chaque jour si les collectes des heures requises (10:00, 14:00, 17:00) sont présentes.
// Si toutes les heures sont présentes pour un jour, elle calcule les moyennes. Sinon, elle laisse les valeurs de moyenne (moyenneTemp, moyenneHum) à null.
exports.getWeeklyHistory = async (req, res) => {
  try {
    const { startDate } = req.query;

    // Convertir la date de début en objet Date
    const start = new Date(startDate);

    // Trouver le lundi de la semaine de la date fournie
    const dayOfWeek = start.getUTCDay(); // 0 = dimanche, 1 = lundi, ..., 6 = samedi
    const diffToMonday = (dayOfWeek + 6) % 7; // Calculer le nombre de jours à soustraire pour obtenir le lundi
    const mondayDate = new Date(start.getTime() - diffToMonday * 24 * 60 * 60 * 1000);

    // Calculer la date de fin (dimanche de la même semaine)
    const sundayDate = new Date(mondayDate.getTime() + 6 * 24 * 60 * 60 * 1000);

    // Filtrer les collectes entre le lundi et le dimanche
    const collectes = await Collecte.find({
      date: { $gte: mondayDate, $lte: sundayDate }
    }).sort({ date: 1 });

    const requiredTimes = ["10:00", "14:00", "17:00"];
    const historique = {};

    // Initialiser chaque jour de la semaine avec des valeurs par défaut (null pour les moyennes)
    const jours = ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi", "Dimanche"];
    
    for (let i = 0; i < 7; i++) {
      const currentDate = new Date(mondayDate.getTime() + i * 24 * 60 * 60 * 1000);
      const day = currentDate.toISOString().split('T')[0];
      const jourNom = jours[i]; // Obtenir le nom du jour

      historique[day] = {
        date: day,
        jour: jourNom, // Ajouter le nom du jour
        moyenneTemp: null,
        moyenneHum: null,
        collectes: []
      };
    }

    // Remplir les collectes par jour
    collectes.forEach(collecte => {
      const day = collecte.date.toISOString().split('T')[0];
      if (historique[day]) {
        historique[day].collectes.push(collecte);
      }
    });

    // Calculer les moyennes pour chaque jour où toutes les heures sont présentes
    for (const day in historique) {
      const data = historique[day];
      const collecteTimes = data.collectes.map(collecte => collecte.time);
      const hasAllTimes = requiredTimes.every(time => collecteTimes.includes(time));

      if (hasAllTimes) {
        const totalTemp = data.collectes.reduce((sum, collecte) => sum + collecte.température, 0);
        const totalHum = data.collectes.reduce((sum, collecte) => sum + collecte.humidite, 0);
        data.moyenneTemp = totalTemp / data.collectes.length;
        data.moyenneHum = totalHum / data.collectes.length;
      }
    }

    res.status(200).json(Object.values(historique));
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la récupération des données hebdomadaires' });
  }
};
