
const puppeteer = require('puppeteer');
// const { MongoClient } = require("mongodb");
// const uri =
//     "mongodb+srv://Aleksis:Qwedsazxc@mycluster.gimbegv.mongodb.net/?retryWrites=true&w=majority";
//
// const client = new MongoClient(uri);
//
function parse (link) {
    return new Promise(async (resolve, reject) => {
        try {
            const browser = await puppeteer.launch({
                headless: false,
                args: ['--no-sandbox', '--disable-setuid-sandbox']
            });
            const page = await browser.newPage();
            // await page.setRequestInterception(true);
            // page.on('request', (request) => {
            //     if (request.resourceType() === 'document') {
            //         request.continue();
            //     } else {
            //         request.abort();
            //     }
            // });
            await page.goto(link);
            await page.waitForTimeout(5000);

            let urls = await page.evaluate(() => {
                var results = [];
                let items = document.querySelectorAll('a.e1h8dali1');
                let items1 = document.querySelectorAll('p.efhm1m90');
                var i = 0;
                items.forEach((item) => {
                    results.push({
                        "name": item.innerHTML,
                        "description": items1[i].innerHTML,
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
            await page.goto("https://www.farfetch.com/uk/shopping/men/jackets-2/items.aspx");
            await page.click('[data-testid="Button_PrivacySettingsBanner_AcceptAll"]');
            await page.waitForTimeout(2000);
            let urls = await page.evaluate(() => {
                var results = [];
                let links = document.querySelectorAll('[data-component="ProductCardLink"]');
                var i = 0;
                links.forEach((item) => {
                    if (item.getAttribute('href').slice(0,2)==="//"){
                                i++;
                            } else {
                                let link = 'https://www.farfetch.com' + item.getAttribute('href');
                                results.push(link);
                                i++;
                            }

                });
                // while (i < 30){
                //     if (links[i].getAttribute('href').slice(0,2)==="//"){
                //         i++;
                //     } else {
                //         let link = links[i].getAttribute('href');
                //         results.push(link);
                //         i++;
                //     }

                //}
                return results;
            })

            browser.close();
            return resolve(urls);
        } catch (e) {
            return reject(e);
        }
    })
}

async function launchPromisesWithDelay(promises, delay) {
    let results = [];
    for (let i = 2; i < promises.length; i++) {
        let result = await promises[i]();
        results.push(result);
        if (i < promises.length - 1) {
            await new Promise(resolve => setTimeout(resolve, delay));
        }
    }
    return results;
}

// parseLinks().then(async (links) => {
//     let promises = links.map(link => () => parse(link));
//     let results = await launchPromisesWithDelay(promises, 100);
//     console.log(results);
// }).catch(console.error);

parseLinks().then(console.log).catch(console.error);

// parseLinks().then(async (links) => {
//     let results = await Promise.all(links.map(link => parse(link)));
//     console.log(results);
// }).catch(console.error);
//
// parseLinks().then((links) => {
//     links.forEach(async (link) => {
//         let result = await parse(link);
//         console.log(result);
//     });
// }).catch(console.error);

//
async function sequentialPromises() {
    let links = await parseLinks();
    console.log(links);
    for (let i =2; i < links.length; i++) {
        let result = await parse(links[i]);
        console.log(links[i]);
        console.log(result);
    }
}
//sequentialPromises();
//
// async function parseLinks(){
//     const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox', '--disable-setuid-sandbox'] });
//     const page = await browser.newPage();
//     await page.setRequestInterception(true);
//     page.on('request', (request) => {
//         if (request.resourceType() === 'document') {
//             request.continue();
//         } else {
//             request.abort();
//         }
//     });
//     await page.goto("https://www.farfetch.com/uk/shopping/men/jackets-2/items.aspx");
//
//     const links = await page.evaluate(() => {
//         let links = document.querySelectorAll('[data-component="ProductCardLink"]');
//         return Array.from(links).map(item => 'farfetch.com'+item.getAttribute('href'));
//     });
//     browser.close();
//
//     //const parsePromises = links.map(link => parse(link));
//     return links;
// }
//
// parseLinks().then(async (links) => {
//     let results = await Promise.all(links.map(link => parse(link)));
//     console.log(results);
// }).catch(console.error);



