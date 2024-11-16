// Importer les modules nécessaires
const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const WebSocket = require('ws');
const http = require('http'); // Module pour créer un serveur HTTP
const Collecte = require('./models/Collecte');
const userRoutes = require('./routes/user');
const collecteRoutes = require('./routes/collecte');
const { swaggerDocs, swaggerUi } = require('./utils/swagger');

// Charger les variables d'environnement
dotenv.config();

// Initialiser l'application Express
const app = express();

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

// Ajouter les routes API
app.use('/api/user', userRoutes);
app.use('/api/collecte', collecteRoutes);

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