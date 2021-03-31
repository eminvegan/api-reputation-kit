import {
	getAmount,
	getFirstPage,
	getAll,
	getReviews,
} from '../controllers/googleController';

const routes = (app) => {

	app.get('/google/:placeID/all', async (req, res) => {
		res.setHeader('Connection', 'keep-alive');
		res.setHeader('Cache-Control', 'no-cache');
		res.setHeader('Access-Control-Allow-Origin', '*');
		await getAll(req, res);
	});

	app.get('/google/:placeID/page', async (req, res) => {
		res.setHeader('Connection', 'keep-alive');
		res.setHeader('Cache-Control', 'no-cache');
		res.setHeader('Access-Control-Allow-Origin', '*');
		await getFirstPage(req, res);
	});

	app.get('/google/:placeID/amount', async (req, res) => {
		res.setHeader('Connection', 'keep-alive');
		res.setHeader('Cache-Control', 'no-cache');
		res.setHeader('Access-Control-Allow-Origin', '*');
		await getAmount(req, res);
	});

	app.get('/google/:placeID/reviews', async (req, res) => {
		res.setHeader('Connection', 'keep-alive');
		res.setHeader('Cache-Control', 'no-cache');
		res.setHeader('Access-Control-Allow-Origin', '*');
		await getReviews(req, res);
	});

};

export default routes;
