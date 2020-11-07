import express from 'express';
import routes from './src/routes/googleRoutes';
// import mongoose from 'mongoose';
import bodyParser from 'body-parser';

const app = express();
const PORT = 3000;

// mongoose.Promise = global.Promise;
// mongoose.connect('mongodb://localhost/CRMdb', {
//     useNewUrlParser: true,
//     useUnifiedTopology: true
// });

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

routes(app);

app.get('/', (req, res) => res.send('app.get'));

app.listen(PORT, () => console.log('app.listen'));
