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

let code = '';
let lastKeyTime = Date.now();
const timeout = 3000;

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
    io.emit('keypadData', code);
    code = '';
  }
});

io.on('connection', (socket) => {
  console.log('Client connecté via Socket.IO');
  socket.on('disconnect', () => {
    console.log('Client déconnecté');
  });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Une erreur est survenue!');
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Serveur démarré sur le port ${PORT}`);
});
