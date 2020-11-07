import { addReview, getReviews } from '../controllers/googleController';

const routes = (app) => {

    app.route('/google')

        .get((req, res, next) => {
            console.log(`Request from: ${req.originalUrl}`);
            console.log(`Request type: ${req.method}`);
            next();
        }, getReviews);

};

export default routes;