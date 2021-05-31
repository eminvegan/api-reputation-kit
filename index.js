import express from 'express';
import routes from './src/routes/googleRoutes';
import cors from 'cors';

const app = express();
const PORT = 3000;

const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:4200',
  'https://dein-ruf.de',
  'http://dein-bewertungsprofi.de',
  'https://dein-bewertungsprofi.local:8890',
];

const options = {
  origin: allowedOrigins,
};

app.use(cors(options));

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

routes(app);

app.get('/', (req, res) => res.send('app.get'));

app.listen(PORT, () => console.log('app.listen'));
