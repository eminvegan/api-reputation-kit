import express from 'express';
import routes from './src/routes/googleRoutes';
import cors from 'cors';

const app = express();
const PORT = 3000;

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use(cors);

routes(app);

app.get('/', (req, res) => res.send('app.get'));

app.listen(PORT, () => console.log('app.listen'));
