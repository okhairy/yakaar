const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const http = require('http');
const socketIo = require('socket.io');
const { SerialPort, ReadlineParser } = require('serialport');
const Collecte = require('./models/Collecte');
const userRoutes = require('./routes/user');
const collecteRoutes = require('./routes/collecte');
const { swaggerDocs, swaggerUi } = require('./utils/swagger');

dotenv.config();

const app = express();

app.use(
  cors({
    origin: 'http://localhost:4200',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  })
);
app.options('*', cors());

mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('Connecté à MongoDB'))
  .catch((error) => console.error('Erreur de connexion à MongoDB:', error));

app.use(express.json());

app.use('/api/user', userRoutes);
app.use('/api/collecte', collecteRoutes);

app.get('/', (req, res) => {
  res.send("Bienvenue sur l'API YAKAR");
});

app.get('/test-socket', (req, res) => {
  res.send({ status: 'WebSocket is running!' });
});

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: 'http://localhost:4200',
    methods: ['GET', 'POST'],
  },
});

let code = ''; // Stocke le code en cours de saisie
let lastKeyTime = Date.now(); // Temps de la dernière touche appuyée
const timeout = 3000; // Timeout de 3 secondes pour détecter un code complet

// Configuration du port série
const serialPort = new SerialPort({
  path: '/dev/ttyUSB0',
  baudRate: 9600,
});

const parser = serialPort.pipe(new ReadlineParser({ delimiter: '\n' }));

serialPort.on('open', () => {
  console.log('Port série ouvert : /dev/ttyUSB0');
});

serialPort.on('error', (err) => {
  console.error('Erreur sur le port série :', err.message);
});

// Lecture des données du port série
parser.on('data', (data) => {
  const key = data.trim();
  console.log('Données reçues du port série :', key);

  // Vérifie si la donnée reçue est une touche valide (chiffre)
  if (/^\d$/.test(key)) {
    code += key;
    lastKeyTime = Date.now();
    console.log(`Touche appuyée : ${key}`);
  }

  // Vérifie si un code complet est saisi après un délai d'inactivité
  const now = Date.now();
  if (now - lastKeyTime > timeout && code) {
    console.log(`Code complet reçu : ${code}`);
    io.emit('keypad-input', code); // Envoi du code au client via WebSocket
    code = ''; // Réinitialise le code après envoi
  }
});

// Gestion des connexions Socket.IO
io.on('connection', (socket) => {
  console.log('Client connecté via Socket.IO');

  // Capture tous les événements pour diagnostic
  socket.onAny((event, ...args) => {
    console.log(`Événement reçu : ${event}`, args);
  });

  // Déconnexion
  socket.on('disconnect', () => {
    console.log('Client déconnecté');
  });
});

// Gestion des erreurs
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Une erreur est survenue!');
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Serveur démarré sur le port ${PORT}`);
});
