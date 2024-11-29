const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const http = require('http');
const { Server } = require('socket.io');
const { SerialPort } = require('serialport');
const { ReadlineParser } = require('@serialport/parser-readline');
const Collecte = require('./models/Collecte');
const userRoutes = require('./routes/user');
const collecteRoutes = require('./routes/collecte');
const { swaggerDocs, swaggerUi } = require('./utils/swagger');

dotenv.config();

const app = express();

// Création du serveur HTTP
const server = http.createServer(app);

// Configuration de Socket.IO
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:4200', // URL de ton client Angular
    methods: ['GET', 'POST'],
  },
});

io.on('connection', (socket) => {
  console.log('Un client Angular est connecté.');

  socket.on('disconnect', () => {
    console.log('Un client Angular s\'est déconnecté.');
  });
});

// Middleware CORS
app.use(
  cors({
    origin: 'http://localhost:4200',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  })
);
app.options('*', cors());

mongoose.connect('mongodb://localhost/yakarDB');

// Middleware JSON
app.use(express.json());

// Routes
app.use('/api/user', userRoutes);
app.use('/api/collecte', collecteRoutes);

app.get('/', (req, res) => {
  res.send("Bienvenue sur l'API YAKAR");
});

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Configuration du port série
const port = new SerialPort({
  path: '/dev/ttyUSB0', // Le chemin de ton port série
  baudRate: 9600, // Le débit en bauds
});
const parser = port.pipe(new ReadlineParser({ delimiter: '\n' }));

port.on('open', () => {
  console.log('Port série ouvert.');
});

// Écoute des données du Keypad
parser.on('data', (data) => {
  const codeSecret = data.trim();
  console.log('Code reçu du Keypad:', codeSecret);

  // Transmission du code au client Angular via WebSocket
  io.emit('code-secret', codeSecret);
});

port.on('error', (err) => {
  console.error('Erreur sur le port série:', err.message);
});

// Gestion des erreurs
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Une erreur est survenue!');
});

// Démarrage du serveur
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Serveur démarré sur le port ${PORT}`);
});

