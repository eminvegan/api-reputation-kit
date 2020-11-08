import puppeteer from 'puppeteer';
import { GoogleSchema } from '../models/googleModel';

const totalReviewCount = 100;

export const getReviews = async (req, res) => {

    // res.json(req.params.url);

    const browser = await puppeteer.launch({
        args: ['--disabled-setuid-sandbox', '--no-sandbox'],
        headless: true
    });

    const page = await browser.newPage();

    await page.goto('https://www.google.com/maps/place/Restaurant+Altes+Landhaus+im+Forstgarten+Kleve/@51.795725,6.1261031,16.08z/data=!4m10!1m2!2m1!1sRestaurants!3m6!1s0x47c7741823c3542d:0xa6b8e7bedc2026a!8m2!3d51.7971002!4d6.1257!9m1!1b1?hl=de');

    await page.waitForSelector('.section-review-text');

    await scrapInfiniteScrollItems(page, totalReviewCount, 100);

    const data = await page.evaluate(() => {
        let authorNameElementList = document.getElementsByClassName('section-review-title');
        let authorNameList = [];
        for (let element of authorNameElementList) {
            authorNameList.push(element.innerText);
        }

        let textElementList = document.getElementsByClassName('section-review-text');
        let textList = [];
        for (let element of textElementList) {
            textList.push(element.innerText);
        }

        return { authorNameList, textList };
    });

    await browser.close();

    res.json(data);

    // return new Promise((resolve, reject) => {
    //     if (reject) {
    //         res.send(reject);
    //     }
    //     resolve(res.json(data));
    // });
};

const scrapInfiniteScrollItems = async (page, totalReviewCount, scrollDelay = 100) => {
    let visibleReviews = await page.evaluate(extractReviewCount);
    while (totalReviewCount > visibleReviews) {
        const previoustHeight = await page.evaluate(getPreviousHeight);
        await page.evaluate(() => {
            let leftSideBar = document.querySelector(".section-scrollbox.scrollable-y");
            leftSideBar.scrollTo(0, leftSideBar.scrollHeight);
        });
        await page.waitForFunction(`document.querySelector('.section-scrollbox.scrollable-y').scrollHeight>${previoustHeight}`);
        await page.waitFor(scrollDelay);
        visibleReviews = await page.evaluate(extractReviewCount);
    }
};

const extractReviewCount = () => {
    return document.querySelectorAll('.section-review-content').length;
};

const getPreviousHeight = () => {
    return document.querySelector('.section-scrollbox.scrollable-y').scrollHeight;
};