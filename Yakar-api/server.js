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

// Connexion à MongoDB
mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('Connecté à MongoDB'))
  .catch((error) => console.error('Erreur de connexion à MongoDB:', error));

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

// Configuration du port série
const serialPort = new SerialPort({
  path: '/dev/ttyUSB0', // Remplacez par votre port série
  baudRate: 9600, // Correspond à la vitesse configurée sur l'Arduino
});

// Configurez le parser pour lire les données ligne par ligne
const parser = serialPort.pipe(new ReadlineParser({ delimiter: '\n' }));

// Vérifier si le port série est ouvert
serialPort.on('open', () => {
  console.log('Port série ouvert : /dev/ttyUSB0');
});

// Logs pour les erreurs du port série
serialPort.on('error', (err) => {
  console.error('Erreur sur le port série :', err.message);
});

// Écouter les données série
parser.on('data', (data) => {
  console.log('Données reçues du port série :', data.trim());
  const key = data.trim();

  if (/^\d$/.test(key)) {
    code += key;
    lastKeyTime = Date.now();
    console.log(`Touche appuyée : ${key}`);
  }

  const now = Date.now();
  if (now - lastKeyTime > timeout && code) {
    console.log(`Code complet reçu : ${code}`);
    console.log('Envoi du code :', code);
io.emit('keypadData', code); // Envoi du code via Socket.IO

    code = ''; // Réinitialiser le code après l'envoi
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
