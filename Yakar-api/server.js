<<<<<<< HEAD
// Importer les modules nécessaires
const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const WebSocket = require('ws');
const http = require('http'); // Module pour créer un serveur HTTP
=======
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const http = require('http'); // Module pour créer un serveur HTTP
const socketIo = require('socket.io'); // Importer socket.io
const { SerialPort, ReadlineParser } = require('serialport');
>>>>>>> aaf84928c5979742508d4548159d7b1b6f39512d
const Collecte = require('./models/Collecte');
const userRoutes = require('./routes/user');
const collecteRoutes = require('./routes/collecte');
const { swaggerDocs, swaggerUi } = require('./utils/swagger');

// Charger les variables d'environnement
dotenv.config();

// Initialiser l'application Express
const app = express();

<<<<<<< HEAD
// Définir le port à partir de la variable d'environnement ou utiliser 5000 par défaut
const PORT = process.env.PORT || 5000;

// Connexion à MongoDB
mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log("Connecté à MongoDB"))
.catch((error) => console.log("Erreur de connexion à MongoDB:", error));

// Middleware pour analyser le JSON
app.use(express.json());

// Route de base pour tester le serveur
app.get('/', (req, res) => {
    res.send("Bienvenue sur l'API YAKAR");
});

=======
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

>>>>>>> aaf84928c5979742508d4548159d7b1b6f39512d
// Ajouter les routes API
app.use('/api/user', userRoutes);
app.use('/api/collecte', collecteRoutes);

<<<<<<< HEAD
// Création du serveur HTTP
const server = http.createServer(app);

// Attacher le serveur WebSocket au serveur HTTP
const wss = new WebSocket.Server({ server });

// Gestion des connexions WebSocket
wss.on('connection', (ws) => {
    console.log('Client connecté via WebSocket');

    // Écouter les messages envoyés par le client WebSocket
    ws.on('message', async (message) => {
        const { action } = JSON.parse(message); // Analyser le message reçu

        if (action === 'toggleFan') {
            try {
                // Récupérer la dernière collecte
                let lastCollecte = await Collecte.findOne().sort({ date: -1 });

                // Si aucune collecte n'existe, en créer une nouvelle
                if (!lastCollecte) {
                    lastCollecte = new Collecte({
                        date: new Date(),
                        time: "10:00",
                        température: 25.5,
                        humidite: 60,
                        ventilateur: false
                    });
                }

                // Basculer l'état du ventilateur
                lastCollecte.ventilateur = !lastCollecte.ventilateur;
                await lastCollecte.save();

                // Notifier tous les clients WebSocket de l'état actuel du ventilateur
                wss.clients.forEach(client => {
                    if (client.readyState === WebSocket.OPEN) {
                        client.send(JSON.stringify({
                            message: `Ventilateur ${lastCollecte.ventilateur ? 'activé' : 'désactivé'}`,
                            ventilateur: lastCollecte.ventilateur
                        }));
                    }
                });
            } catch (error) {
                console.error('Erreur lors du changement d\'état du ventilateur', error);
            }
        }
    });

    // Gérer la déconnexion
    ws.on('close', () => {
        console.log('Client déconnecté du WebSocket');
    });
});

// Gestion des erreurs
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Une erreur est survenue!');
});


// Ajouter Swagger à Express
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));


// Démarrer le serveur HTTP et WebSocket sur le même port
server.listen(PORT, () => {
    console.log(`Serveur démarré sur le port ${PORT}`);
});




// http.createServer(app) : Nous créons un serveur HTTP en passant l'application Express (app). Cela permet à notre serveur d'écouter à la fois les requêtes HTTP et WebSocket.
// WebSocket.Server({ server }) : Ici, nous passons le serveur HTTP directement au serveur WebSocket. Cela permet aux WebSocket de fonctionner sur le même port que le serveur HTTP.
// wss.clients.forEach(client => { ... }) : Cette boucle envoie le nouvel état du ventilateur à tous les clients connectés, afin que l’interface soit mise à jour en temps réel pour tous les utilisateurs.
// PORT : Nous utilisons une seule variable PORT pour éviter les conflits de port.
=======
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
>>>>>>> aaf84928c5979742508d4548159d7b1b6f39512d
