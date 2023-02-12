const puppeteer = require('puppeteer');

function parse (link) {
    return new Promise(async (resolve, reject) => {
        try {
            const browser = await puppeteer.launch({
                headless: false,
                args: ['--no-sandbox', '--disable-setuid-sandbox']
            });
            const page = await browser.newPage();
            await page.goto(link);
            await page.waitForTimeout(5000);

            let urls = await page.evaluate(() => {
                var results = [];
                let items = document.querySelectorAll('[data-qa="product_name"]');
                var i = 0;
                items.forEach((item) => {
                    results.push({
                        "name": item.innerHTML,
                    })
                    i++;
                });
                return results;
            })

            browser.close();
            return resolve(urls);
        } catch (e) {
            return reject(e);
        }
    })
}


function parseLinks() {
    return new Promise(async (resolve, reject) => {
        try {
            const browser = await puppeteer.launch({headless: false});
            const page = await browser.newPage();
            await page.goto('https://www.goat.com/en-gb/search?query=t-shirts');
            await page.waitForTimeout(5000);
            await page.click('#onetrust-accept-btn-handler');
            let urls = await page.evaluate(() => {
                var results = [];
                let all_items = document.querySelectorAll('[data-qa="grid_cell_product"]');
                let product_name = document.querySelectorAll('[data-qa="grid_cell_product_name"]');
                let url = document.querySelectorAll('a.GridCellLink__Link-sc-2zm517-0');
                var i = 0;
                all_items.forEach((item) => {
                    let link = "https://www.goat.com".concat(url[i].getAttribute('href'))
                    results.push(link);
                    i++;
                });
                return results;
            })

            browser.close();
            return resolve(urls);
        } catch (e) {
            return reject(e);
        }
    })
}

const scraperObject = {
    url: 'https://www.goat.com/en-gb/search?query=t-shirts',
    async scraper(browser){
        let page = await browser.newPage();
        console.log(`Navigating to ${this.url}...`);
        await page.goto(this.url);
        await page.waitForTimeout(5000);
        await page.click('#onetrust-accept-btn-handler')


        console.log(urls);
        browser.close()
    }
}

async function sequentialPromises() {
    let links = await parseLinks();
    for (let i = 0; i < links.length; i++) {
        let result = await parse(links[i]);
        console.log(links.length);
        console.log(result);
    }
}
sequentialPromises();

// parseLinks().then(console.log).catch(console.error);