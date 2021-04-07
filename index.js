import express from 'express';
import routes from './src/routes/googleRoutes';

const app = express();
const PORT = 3000;

// mongoose.Promise = global.Promise;
// mongoose.connect('mongodb://localhost/CRMdb', {
//     useNewUrlParser: true,
//     useUnifiedTopology: true
// });
// app.use(cors());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

routes(app);

app.get('/', (req, res) => res.send('app.get'));

app.listen(PORT, () => console.log('app.listen'));
