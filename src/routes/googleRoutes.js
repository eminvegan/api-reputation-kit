import {
  getAmount,
  getFirstPage,
  getAll,
  getReviews,
} from '../controllers/googleController';

var cors = require('cors');

const options = {
  origin: '*',
  optionsSuccessStatus: 200,
};

const routes = (app) => {
  app.get('/google/:placeID/all', cors(options), async (req, res) => {
    res.setHeader('Connection', 'keep-alive');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    await getAll(req, res);
  });

  app.get('/google/:placeID/page', cors(options), async (req, res) => {
    res.setHeader('Connection', 'keep-alive');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    await getFirstPage(req, res);
  });

  app.get('/google/:placeID/amount', cors(options), async (req, res) => {
    res.setHeader('Connection', 'keep-alive');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    await getAmount(req, res);
  });

  app.get('/google/:placeID/reviews', cors(options), async (req, res, next) => {
    res.setHeader('Connection', 'keep-alive');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
  }, async (req, res, next) => {
    await getReviews(req, res);
    next();
  });
};

export default routes;
