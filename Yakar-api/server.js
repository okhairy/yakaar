const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const http = require('http'); // Module pour créer un serveur HTTP
const socketIo = require('socket.io'); // Importer socket.io
const { SerialPort, ReadlineParser } = require('serialport');
const Collecte = require('./models/Collecte');
const userRoutes = require('./routes/user');
const collecteRoutes = require('./routes/collecte');
const { swaggerDocs, swaggerUi } = require('./utils/swagger');

// Charger les variables d'environnement
dotenv.config();

// Initialiser l'application Express
const app = express();

// Configurer CORS avant d’ajouter les routes
app.use(
  cors({
    origin: 'http://localhost:4200', // Autoriser Angular
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE', // Méthodes HTTP autorisées
    credentials: true, // Autorise les cookies si nécessaire
  })
);

// Répondre aux pré-requêtes OPTIONS pour CORS
app.options('*', cors());

mongoose.connect('mongodb://localhost/yakarDB');

// Middleware pour analyser les requêtes JSON
app.use(express.json());

// Ajouter les routes API
app.use('/api/user', userRoutes);
app.use('/api/collecte', collecteRoutes);

// Route de base pour tester le serveur
app.get('/', (req, res) => {
  res.send("Bienvenue sur l'API YAKAR");
});

// Ajouter Swagger à Express
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Création du serveur HTTP
const server = http.createServer(app);

// Initialiser Socket.IO
const io = socketIo(server, {
  cors: {
    origin: 'http://localhost:4200', // Permettre les connexions depuis le frontend Angular
    methods: ['GET', 'POST'],
  },
});

// Variables pour stocker le code et la gestion du timeout
let code = '';
let lastKeyTime = Date.now();
const timeout = 3000; // Timeout de 3 secondes pour réinitialiser le code

// Configuration du port série pour la lecture des données de capteurs
const serialPort = new SerialPort({
  path: '/dev/ttyUSB1', // Remplacez par votre port série
  baudRate: 9600, // Correspond à la vitesse configurée sur l'Arduino
});

// Configurez le parser pour lire les données ligne par ligne
const parser = serialPort.pipe(new ReadlineParser({ delimiter: '\n' }));

// Vérifier si le port série est ouvert
serialPort.on('open', () => {
  console.log('Port série ouvert : /dev/ttyUSB1');
});

// Logs pour les erreurs du port série
serialPort.on('error', (err) => {
  console.error('Erreur sur le port série :', err.message);
});

// Écouter les données série
parser.on('data', (data) => {
  console.log('Données reçues du port série :', data.trim());
  try {
    // Essayer de parser les données en JSON (temperature et humidity)
    const sensorData = JSON.parse(data.trim());

    // Si les données contiennent de la température et de l'humidité, on les envoie via WebSocket
    if (sensorData.temperature !== undefined && sensorData.humidity !== undefined) {
      io.emit('sensor-data', {
        temperature: sensorData.temperature,
        humidity: sensorData.humidity
      });  // Envoi des données au frontend via WebSocket
      console.log(`Température: ${sensorData.temperature}°C, Humidité: ${sensorData.humidity}%`);
    }
  } catch (error) {
    console.error('Erreur de parsing des données JSON:', error);
  }
});

// Gestion des connexions Socket.IO
io.on('connection', (socket) => {
  console.log('Client connecté via Socket.IO');

  // Gérer la déconnexion du client
  socket.on('disconnect', () => {
    console.log('Client déconnecté');
  });
});

// Gestion des erreurs globales
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Une erreur est survenue!');
});

// Définir le port et démarrer le serveur HTTP et Socket.IO
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Serveur démarré sur le port ${PORT}`);
});

