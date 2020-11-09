import puppeteer from 'puppeteer';

const iPhone = puppeteer.devices['iPhone 6'];

export const getReviews = async (req, res) => {

    const PID =  req.params.placeID;
    const GEO =  req.params.geometry.split(',');
    const LAT = GEO[0];
    const LNG = GEO[1];
    const SORT = req.params.sort;

    const browser = await puppeteer.launch({
        args: ['--disabled-setuid-sandbox', '--no-sandbox'],
        headless: true,
        pipe: true
    });

    const page = await browser.newPage();
    await page.emulate(iPhone);
    await page.goto('https://www.google.com/maps/search/?api=1&query=' + LAT + ',' + LNG + '&query_place_id=' + PID);
    await page.waitForNavigation();

    await page.waitForSelector('.section-rating-term > span > span:nth-child(1) > span');

    // total review count
    const totalReviewCount = await page.evaluate(() => {
        return document.querySelector('.section-rating-term > span > span:nth-child(1) > span').innerHTML.replace(/[&\/\\#,+()$~%.'":*?<>{}]/g, '');
    });

    // navigate to all reviews
    const totalReviewButton1 = await page.evaluateHandle(() => {
        return document.querySelector('.section-rating-term');
    });
    await totalReviewButton1.click();
    await page.waitForSelector('button[jsaction="pane.rating.moreReviews"]');
    const totalReviewButton2 = await page.evaluateHandle(() => {
        return document.querySelector('button[jsaction="pane.rating.moreReviews"]');
    });
    await totalReviewButton2.click();
    await page.waitForSelector('div.ml-reviews-page-user-review-container:last-child');

    // load all reviews
    await scrapInfiniteScrollItems(page, totalReviewCount, 100);

    const data = await page.evaluate((PID, LAT, LNG) => {
        let reviews = [];
        document.querySelectorAll('div.ml-reviews-page-user-review-container').forEach((review) => {
            let uid = review.querySelector('.ml-reviews-page-user-review-name').getAttribute('id').replace('ml-reviews-page-user-review-name-', '');
            let name = review.querySelector('.ml-reviews-page-user-review-name').innerHTML;
            let publishDate = review.querySelector('.ml-reviews-page-user-review-publish-date').innerHTML;
            let text = review.querySelector('.ml-reviews-page-user-review-text').innerHTML;
            let ratingContainer = review.querySelector('.ml-rating-stars-container');
            let rating = ratingContainer.getAttribute('aria-label');
            let url = 'https://www.google.com/maps/contrib/' + uid + '/place/' + PID + '/@' + LAT + ',' + LNG + ',10z/data=!4m4!1m3!8m2!1e1!2s115174880875311411362?hl=de-DE';
            reviews.push({ uid, name, publishDate, text, rating, url });
        });
        return reviews;
    }, PID, LAT, LNG);


    await browser.close();

    res.json(data);
};

const scrapInfiniteScrollItems = async (page, totalReviewCount, delay) => {
    let i = 0;
    let tmp = 0;
    let visibleReviews = 0;
    while (visibleReviews <= totalReviewCount) {
        tmp = await page.evaluate(extractReviewCount);
        console.log('tmp: ' + tmp);
        console.log('visibleReviews: ' + visibleReviews);
        if (tmp != visibleReviews) {
            await page.evaluate(() => {
                document.querySelector('div.ml-reviews-page-user-review-container:last-child').scrollIntoView({ block: 'end', inline: 'end' });
            });
            visibleReviews = await page.evaluate(extractReviewCount);
            await page.waitForTimeout(delay);
        } else {
            i++;
            if (i == 3) {
                totalReviewCount = totalReviewCount - (totalReviewCount % visibleReviews);
            }
        }
    }
};

const extractReviewCount = () => {
    return document.querySelectorAll('div.ml-reviews-page-user-review-container').length;
};

const getPreviousHeight = () => {
    return document.querySelector('.ml-reviews-page-white-background > div:nth-child(2)').scrollHeight;
};