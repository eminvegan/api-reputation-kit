const fetch = require('node-fetch');
const { Cluster } = require('puppeteer-cluster');
import puppeteer from 'puppeteer';

const iPhone = puppeteer.devices['iPhone 6'];

let reviews = [];

export const getReviews = async (req, res) => {
  req.socket.setTimeout(3600e3);

  const PID = req.params.placeID;

  reviews = [];

  const browser = await puppeteer.launch({
    args: ['--disabled-setuid-sandbox', '--no-sandbox'],
    headless: true,
  });

  const page = await browser.newPage();

  const viewPort = await page.setViewport({
    width: 375,
    height: 667,
    deviceScaleFactor: 1,
  });

  const emulate = await page.emulate(iPhone);

  const navigate = await page.goto(`https://www.google.com/maps/search/?api=1&query=Google&query_place_id=${PID}&hl=en`);

  try {
    await page.waitForNavigation({ timeout: 1000 });
  } catch (error) {
    console.log(error);
  }

  try {
    const x1 = await page.waitForSelector('button[aria-label*="Cookies"]', {
      timeout: 1000,
    });
  } catch (error) {
    console.log(error);
  }

  try {
    const x2 = await page.click('button[aria-label*="Cookies"]', {
      timeout: 1000,
    });
  } catch (error) {
    console.log(error);
  }

  try {
    const x1 = await page.waitForSelector('button[aria-label*="cookies"]', {
      timeout: 1000,
    });
  } catch (error) {
    console.log(error);
  }

  try {
    const x2 = await page.click('button[aria-label*="cookies"]', {
      timeout: 1000,
    });
  } catch (error) {
    console.log(error);
  }

  await page.waitForTimeout(500);

  await page.setRequestInterception(true);

  const listEntitiesReviews = [];

  page.on('request', async (request) => {
    if (request.url().includes('listentitiesreviews')) {
      listEntitiesReviews.push(request.url());
      // const data = await fetch(request.url(), {
      //   method: 'get',
      //   headers: { 'Content-Type': 'application/json' },
      // });
      // await page.waitForTimeout(500);
      // const x0 = await data;
      // const x1 = await x0.text();
      // const x2 = x1.toString().replace(")]}'", '');
      // const x3 = JSON.parse(x2);
      // if (x3[2] !== null) {
      //   if (x3[2].length > 0) {
      //     await asyncForEach(x3[2], (r, index) => {
      //       const uid = r[6];
      //       const name = r[60][1];
      //       const publishDate = r[27];
      //       const text = r[3];
      //       const rating = r[4];
      //       const url = r[18];
      //       reviews.push({ uid, name, publishDate, text, rating, url });
      //     });
      //   }
      // }
    }
    request.continue();
  });

  try {
    await page.waitForSelector('.ml-promotion-content');
  } catch (error) {
    console.log(error);
  }

  await page.waitForTimeout(500);

  try {
    const noThanks = await page.evaluateHandle(() => {
      return document.querySelector(
        '.ml-promotion-action-button.ml-promotion-no-button.ml-promotion-no-thanks'
      );
    });
    await noThanks.click();
  } catch (error) {
    console.log(error);
  }

  await page.waitForTimeout(500);

  const totalReviewCount = await page.evaluate(() => {
    const amount = document.querySelector(
      '#app > div.ml-pane.mapsLiteJsPanePanestyle__flexible.mapsLiteJsPanePanestyle__collapsed > div > div.widget-pane-content.mapsConsumerUiCommonScrollable__scrollable-y.mapsConsumerUiCommonScrollable__scrollable-show > div > div > div > div:nth-child(1) > div.mapsConsumerUiSubviewSectionHeroheadertitle__section-hero-header-title > div.mapsConsumerUiSubviewSectionHeroheadertitle__section-hero-header-title-top-container > div.mapsConsumerUiSubviewSectionHeroheadertitle__section-hero-header-title-description > div.mapsConsumerUiSubviewSectionHeroheadertitle__section-hero-header-title-description-container > div.mapsConsumerUiSubviewSectionRating__section-rating > div.gm2-body-2.mapsConsumerUiSubviewSectionRating__section-rating-line > span:nth-child(3) > span > span > span:nth-child(2) > span:nth-child(1) > span'
    ).innerHTML;
    // console.log(amount);
    return amount.replace(/[&\/\\#,+()$~%.'":*?<>{}]/g, '');
    // console.log(var1);
    return amount;
  });

  await page.waitForTimeout(500);

  try {
    const showDetails = await page.evaluateHandle(() => {
      if (
        document.querySelector('[aria-label*="details"]') != 'undefined' &&
        document.querySelector('[aria-label*="details"]') != null
      ) {
        return document.querySelector('[aria-label*="details"]');
      } else {
        return document.querySelector('[aria-label*="Details"]');
      }
    });
    await showDetails.click();
  } catch (error) {
    console.log(error);
  }

  await page.waitForTimeout(500);

  try {
    await page.waitForSelector('button[jsaction="pane.rating.moreReviews"]');
    const showReviews = await page.evaluateHandle(() => {
      return document.querySelector('button[jsaction="pane.rating.moreReviews"]');
    });
    await showReviews.click();
  } catch (error) {
    console.log(error);
  }

  await page.waitForTimeout(500);

  try {
    await page.waitForSelector(
      '#app > div.ml-pane-container > div.visible > div > div.mapsLiteJsReviewsReviewspage__ml-reviews-page-white-background > div:nth-child(2)'
    );
  } catch (error) {
    console.log(error);
    console.log(page.url());
  }

  try {
    await scrapInfiniteScrollItems(res, page, totalReviewCount, 750);
  } catch (error) {
    console.log(error);
  }

  const start1 = async () => {
    const reviews = [];
    await asyncForEach(listEntitiesReviews, async (url, index) => {
      console.log(`Fetching URL ${index + 1}/${listEntitiesReviews.length}...`);
      console.log(url);
      try {
        const data = await fetch(url, {
          method: 'get',
          headers: { 'Content-Type': 'application/json' },
        });
        console.log(`Fetching finished.`);
        console.log(`Parsing fetched data...`);
        const x0 = await data;
        const x1 = await x0.text();
        const x2 = x1.toString().replace(")]}'", '');
        const x3 = JSON.parse(x2);
        if (x3[2] !== null) {
          if (x3[2].length > 0) {
            await asyncForEach(x3[2], (r, index) => {
              console.log(index);
              const uid = r[6];
              const name = r[60][1];
              const publishDate = r[27];
              const text = r[3];
              const rating = r[4];
              const url = r[18];
              reviews.push({ uid, name, publishDate, text, rating, url });
            });
            console.log(`Parsing finished.`);
          }
        }
      } catch (error) {
        console.log(error);
      }
    });
    await browser.close();
    res.setHeader('Connection', 'keep-alive');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.json(reviews);
    res.end();
  };

  start1();
};

const scrapInfiniteScrollItems = async (res, page, totalReviewCount, delay) => {
  page.setDefaultTimeout(5000);
  let currentReviewsCount = 0;
  try {
    let previousReviewsCount;
    let previousHeight;
    while (currentReviewsCount <= totalReviewCount) {
      previousReviewsCount = currentReviewsCount;
      previousHeight = await page.evaluate(
        () =>
          document.querySelector(
            '#app > div.ml-pane-container > div.visible > div > div.mapsLiteJsReviewsReviewspage__ml-reviews-page-white-background > div:nth-child(2)'
          ).scrollHeight
      );
      await page.evaluate(
        `document.querySelector('.mapsLiteJsReviewsReviewspage__ml-reviews-page-user-review-loading').scrollIntoView({ block: 'end', inline: 'end' })`
      );
      await page.waitForFunction(
        `document.querySelector('#app > div.ml-pane-container > div.visible > div > div.mapsLiteJsReviewsReviewspage__ml-reviews-page-white-background > div:nth-child(2)').scrollHeight > ${previousHeight}`
      );
      await page.waitForTimeout(delay);
      currentReviewsCount = await page.evaluate(getReviewCount);
      // console.log(reviews.length);
      console.log(`currentReviewsCount ${currentReviewsCount} + '/' + totalReviewCount ${totalReviewCount}`);
      if (currentReviewsCount == totalReviewCount) {
        await page.waitForTimeout(2222);
        break;
      }
    }
  } catch (error) {
    console.log(error);
  }
};

const getReviewCount = () => {
  return document.querySelectorAll('.mapsLiteJsReviewsReviewspage__ml-reviews-page-user-review-container')
    .length;
};

async function asyncForEach(array, callback) {
  for (let index = 0; index < array.length; index++) {
    await callback(array[index], index, array);
  }
}
