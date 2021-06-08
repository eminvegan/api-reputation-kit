import express from 'express';
import routes from './src/routes/googleRoutes';
import cors from 'cors';

const app = express();
const PORT = 3000;

// const allowedOrigins = [
//   'http://localhost:3000',
//   'http://localhost:4200',
//   'http://127.0.0.1:8000',
//   'https://assessmentprofessional.etechnocrat.tech',
//   'https://dein-ruf.de',
//   'https://dein-bewertungsprofi.de',
//   'https://dein-bewertungsprofi.de/',
//   'https://dein-bewertungsprofi.de/review-reporter',
//   'https://dein-bewertungsprofi.de/review-reporter/',
//   'https://dein-bewertungsprofi.local:8890',
//   'https://dein-bewertungsprofi.local:8890/',
//   'https://dein-bewertungsprofi.local:8890/review-reporter',
//   'https://dein-bewertungsprofi.local:8890/review-reporter/',
// ];

// const options = {
//   origin: '*',
//   optionsSuccessStatus: 200,
// };

// app.use(cors(options));

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

routes(app);

app.get('/', (req, res) => res.send('app.get'));

app.listen(PORT, () => console.log('app.listen'));
