const fetch = require('node-fetch');
import puppeteer from 'puppeteer';

const iPhone = puppeteer.devices['iPhone 6'];

export const getAmount = async (req, res) => {
	const PID = req.params.placeID;
	const browser = await puppeteer.launch({
		args: ['--disabled-setuid-sandbox', '--no-sandbox'],
		headless: true,
	});
	const page = await browser.newPage();
	await page.setViewport({
		width: 375,
		height: 667,
		deviceScaleFactor: 1,
	});
	await page.emulate(iPhone);
	await page.goto('https://www.google.com/maps/search/?api=1&query=Google&query_place_id=' + PID);
	await page.waitForNavigation();

	await page.waitForSelector('button[aria-label*="cookies"]');
	await page.waitForTimeout(150);
	const cookieConsentBanner = await page.evaluateHandle(() => {
		return document.querySelector('button[aria-label*="cookies"]');
	});
	await page.waitForTimeout(150);
	cookieConsentBanner.click();

	page.setDefaultTimeout(0);
	await page.waitForSelector('.ml-promotion-content');
	await page.waitForTimeout(500);
	const noThanks = await page.evaluateHandle(() => {
		return document.querySelector('.ml-promotion-action-button.ml-promotion-no-button.ml-promotion-no-thanks');
	});
	await noThanks.click();
	await page.waitForTimeout(500);
	const totalReviewCount = await page.evaluate(() => {
		const amount = document.querySelector('.section-rating-term > span:not(.section-rating-line-context-divider) > span:nth-child(1) > span').innerHTML;
		return amount.replace(/[&\/\\#,+()$~%.'":*?<>{}]/g, '');
	});
	await browser.close();
	res.json(totalReviewCount);
	res.end();
};

export const getFirstPage = async (req, res) => {
	const PID = req.params.placeID;
	const browser = await puppeteer.launch({
		args: ['--disabled-setuid-sandbox', '--no-sandbox'],
		headless: true,
	});
	const page = await browser.newPage();
	await page.setViewport({
		width: 375,
		height: 667,
		deviceScaleFactor: 1,
	});
	await page.emulate(iPhone);
	await page.goto('https://www.google.com/maps/search/?api=1&query=Google&query_place_id=' + PID);
	await page.waitForNavigation();

	await page.waitForSelector('button[aria-label*="cookies"]');
	await page.waitForTimeout(150);
	const cookieConsentBanner = await page.evaluateHandle(() => {
		return document.querySelector('button[aria-label*="cookies"]');
	});
	await page.waitForTimeout(150);
	cookieConsentBanner.click();

	await page.waitForSelector('.ml-promotion-content');
	await page.waitForTimeout(500);
	const noThanks = await page.evaluateHandle(() => {
		return document.querySelector('.ml-promotion-action-button.ml-promotion-no-button.ml-promotion-no-thanks');
	});
	await noThanks.click();
	await page.waitForTimeout(500);
	const showDetails = await page.evaluateHandle(() => {
		if (document.querySelector('[aria-label*="details"]') != 'undefined' && document.querySelector('[aria-label*="details"]') != null) {
			return document.querySelector('[aria-label*="details"]');
		} else {
			return document.querySelector('[aria-label*="Details"]');
		}
	});
	await showDetails.click();
	await page.waitForTimeout(500);
	await page.waitForSelector('button[jsaction="pane.rating.moreReviews"]');
	const showReviews = await page.evaluateHandle(() => {
		return document.querySelector('button[jsaction="pane.rating.moreReviews"]');
	});
	await showReviews.click();
	await page.waitForTimeout(500);
	await page.waitForSelector('.ml-reviews-page-user-review-container[jsinstance^="*"]');
	try {
		await scrapInfiniteScrollItems(res, page, 72, 500);
	} catch (e) {}
	const data = await page.evaluate(PID => {
		let reviews = [];
		document.querySelectorAll('div.ml-reviews-page-user-review-container').forEach(review => {
			let uid = review.querySelector('.ml-reviews-page-user-review-name').getAttribute('id').replace('ml-reviews-page-user-review-name-', '');
			let name = review.querySelector('.ml-reviews-page-user-review-name').innerHTML;
			let publishDate = review.querySelector('.ml-reviews-page-user-review-publish-date').innerHTML;
			let text = review.querySelector('.ml-reviews-page-user-review-text').innerHTML;
			let ratingContainer = review.querySelector('.ml-rating-stars-container');
			let rating = ratingContainer.getAttribute('aria-label');
			let url = 'https://www.google.com/maps/contrib/' + uid + '/place/' + PID + '/@,10z/data=!4m4!1m3!8m2!1e1!2s115174880875311411362?hl=de-DE';
			reviews.push({
				uid,
				name,
				publishDate,
				text,
				rating,
				url,
			});
		});
		return reviews;
	}, PID);
	await browser.close();
	res.json(data);
	res.end();
};

export const getAll = async (req, res) => {
	const PID = req.params.placeID;
	const browser = await puppeteer.launch({
		args: ['--disabled-setuid-sandbox', '--no-sandbox'],
		headless: true,
	});
	const page = await browser.newPage();
	await page.setViewport({
		width: 375,
		height: 667,
		deviceScaleFactor: 1,
	});
	await page.emulate(iPhone);
	await page.goto('https://www.google.com/maps/search/?api=1&query=Google&query_place_id=' + PID);
	await page.waitForNavigation();

	await page.waitForSelector('button[aria-label*="cookies"]');
	await page.waitForTimeout(150);
	const cookieConsentBanner = await page.evaluateHandle(() => {
		return document.querySelector('button[aria-label*="cookies"]');
	});
	await page.waitForTimeout(150);
	cookieConsentBanner.click();

	page.setDefaultTimeout(0);
	await page.waitForSelector('.ml-promotion-content');
	await page.waitForTimeout(500);
	const noThanks = await page.evaluateHandle(() => {
		return document.querySelector('.ml-promotion-action-button.ml-promotion-no-button.ml-promotion-no-thanks');
	});
	await noThanks.click();
	await page.waitForTimeout(500);
	const totalReviewCount = await page.evaluate(() => {
		const amount = document.querySelector('.section-rating-term > span:not(.section-rating-line-context-divider) > span:nth-child(1) > span').innerHTML;
		return amount.replace(/[&\/\\#,+()$~%.'":*?<>{}]/g, '');
	});
	await page.waitForTimeout(500);
	const showDetails = await page.evaluateHandle(() => {
		if (document.querySelector('[aria-label*="details"]') != 'undefined' && document.querySelector('[aria-label*="details"]') != null) {
			return document.querySelector('[aria-label*="details"]');
		} else {
			return document.querySelector('[aria-label*="Details"]');
		}
	});
	await showDetails.click();
	await page.waitForTimeout(500);
	await page.waitForSelector('button[jsaction="pane.rating.moreReviews"]');
	const showReviews = await page.evaluateHandle(() => {
		return document.querySelector('button[jsaction="pane.rating.moreReviews"]');
	});
	await showReviews.click();
	await page.waitForTimeout(500);
	await page.waitForSelector('.ml-reviews-page-user-review-container[jsinstance^="*"]');

	try {
		await scrapInfiniteScrollItems(res, page, totalReviewCount, 250);
	} catch (e) {}
	const data = await page.evaluate(PID => {
		let reviews = [];
		document.querySelectorAll('div.ml-reviews-page-user-review-container').forEach(review => {
			let uid = review.querySelector('.ml-reviews-page-user-review-name').getAttribute('id').replace('ml-reviews-page-user-review-name-', '');
			let name = review.querySelector('.ml-reviews-page-user-review-name').innerHTML;
			let publishDate = review.querySelector('.ml-reviews-page-user-review-publish-date').innerHTML;
			let text = review.querySelector('.ml-reviews-page-user-review-text').innerHTML;
			let ratingContainer = review.querySelector('.ml-rating-stars-container');
			let rating = ratingContainer.getAttribute('aria-label');
			let url = 'https://www.google.com/maps/contrib/' + uid + '/place/' + PID + '/@,10z/data=!4m4!1m3!8m2!1e1!2s115174880875311411362?hl=de-DE';
			reviews.push({
				uid,
				name,
				publishDate,
				text,
				rating,
				url,
			});
		});
		return reviews;
	}, PID);
	await browser.close();
	res.json(data);
	res.end();
};

export const getReviews = async (req, res) => {
	const PID = req.params.placeID;
	const browser = await puppeteer.launch({
		args: ['--disabled-setuid-sandbox', '--no-sandbox'],
		headless: false,
	});
	const page = await browser.newPage();
	await page.setViewport({
		width: 375,
		height: 667,
		deviceScaleFactor: 1,
	});
	await page.emulate(iPhone);
	await page.goto('https://www.google.com/maps/search/?api=1&query=Google&query_place_id=' + PID);

	await page.waitForSelector('button[aria-label*="cookies"]');
	await page.waitForTimeout(150);
	const cookieConsentBanner = await page.evaluateHandle(() => {
		return document.querySelector('button[aria-label*="cookies"]');
	});
	await page.waitForTimeout(150);
	cookieConsentBanner.click();
	

	await page.waitForNavigation();
	page.setDefaultTimeout(0);



	await page.setRequestInterception(true);
	const listEntitiesReviews = [];
	page.on('request', request => {
		if (request.url().includes('listentitiesreviews')) {
			listEntitiesReviews.push(request.url());
		}
		request.continue();
	  });
	



	await page.waitForSelector('.ml-promotion-content');
	await page.waitForTimeout(500);
	const noThanks = await page.evaluateHandle(() => {
		return document.querySelector('.ml-promotion-action-button.ml-promotion-no-button.ml-promotion-no-thanks');
	});
	await noThanks.click();
	await page.waitForTimeout(500);
	const totalReviewCount = await page.evaluate(() => {
		const amount = document.querySelector('.section-rating-term > span:not(.section-rating-line-context-divider) > span:nth-child(1) > span').innerHTML;
		return amount.replace(/[&\/\\#,+()$~%.'":*?<>{}]/g, "");
	});
	await page.waitForTimeout(500);
	const showDetails = await page.evaluateHandle(() => {
		if (document.querySelector('[aria-label*="details"]') != 'undefined' && document.querySelector('[aria-label*="details"]') != null) {
			return document.querySelector('[aria-label*="details"]');
		} else {
			return document.querySelector('[aria-label*="Details"]');
		}
	});
	await showDetails.click();
	await page.waitForTimeout(500);
	await page.waitForSelector('button[jsaction="pane.rating.moreReviews"]');
	const showReviews = await page.evaluateHandle(() => {
		return document.querySelector('button[jsaction="pane.rating.moreReviews"]');
	});
	await showReviews.click();
	await page.waitForTimeout(500);
	await page.waitForSelector('.ml-reviews-page-user-review-container[jsinstance^="*"]');

	try {
		await scrapInfiniteScrollItems(res, page, totalReviewCount, 250);
	} catch (error) {}

	const start1 = async () => {
		const reviews = [];
		console.log(listEntitiesReviews.length);
		await asyncForEach(listEntitiesReviews, async (url) => {
			let array1 = [];
			const data = await fetch(url, {
				method: 'get',
				headers: { 'Content-Type': 'application/json' },
			});
			const x0 = await data;
			const x1 = await x0.text();
			const x2 = x1.toString().replace(")]}'", '');
			const x3 = JSON.parse(x2);
			await asyncForEach(x3[2], (r) => {
				const uid = r[6];
				const name = r[60][1];
				const publishDate = r[27];
				const text = r[3];
				const rating = r[4];
				const url = r[18];
				reviews.push({ uid, name, publishDate, text, rating, url });
			});
			// const start2 = async () => {
			// 	console.log(x3[2].length);
			// 	await asyncForEach(x3[2], (r) => {
			// 		const uid = r[6];
			// 		const name = r[60][1];
			// 		const publishDate = r[27];
			// 		const text = r[3];
			// 		const rating = r[4];
			// 		const url = r[18];
			// 		reviews.push({ uid, name, publishDate, text, rating, url });
			// 	});
			// };
			// start2();
			// reviews.push(array1);
			
		});
		// const xyz = reviews.flat(2);
		console.log(reviews.length);
		await browser.close();
		res.json(reviews);
		res.end();
	}
	start1();
};

const scrapInfiniteScrollItems = async (res, page, totalReviewCount, delay) => {
	page.setDefaultTimeout(1339);
	let currentReviewsCount = 0;
	try {
		let previousReviewsCount;
		let previousHeight;
		while (currentReviewsCount <= totalReviewCount) {
			previousReviewsCount = currentReviewsCount;
			previousHeight = await page.evaluate(() => document.querySelector('.ml-reviews-page-white-background > div:not(.ml-appbar):not(.ml-reviews-page-user-review-loading)').scrollHeight);
			await page.evaluate(`document.querySelector('.ml-reviews-page-user-review-container[jsinstance^="*"]').scrollIntoView({ block: 'end', inline: 'end' })`);
			await page.waitForFunction(`document.querySelector('.ml-reviews-page-white-background > div:not(.ml-appbar):not(.ml-reviews-page-user-review-loading)').scrollHeight > ${previousHeight}`);
			await page.waitForTimeout(delay);
			currentReviewsCount = await page.evaluate(getReviewCount);
			console.log(previousReviewsCount + "/" + currentReviewsCount);
		}
	} catch (error) {}
};

const getReviewCount = () => {
	return document.querySelectorAll('.ml-reviews-page-user-review-container').length;
};

const getPreviousHeight = () => {
	return document.querySelector('.ml-reviews-page-white-background > div:nth-child(2)').scrollHeight;
};

async function asyncForEach(array, callback) {
	for (let index = 0; index < array.length; index++) {
		await callback(array[index], index, array);
	}
}