const puppeteer = require('puppeteer-extra');
const stealth   = require('puppeteer-extra-plugin-stealth');
const fs		= require('fs').promises;
const mailer    = require('./mailer.js');
const utils       = require('./utils.js');
const { toUSVString } = require('util');

var isAvailable = false;
var ticket      = false;
var captcha     = false;
var n_run       = 1;
var g_url;
var proxy_arr   = ['--proxy-server=socks5://127.0.0.1:9050', '--proxy-server=socks5://127.0.0.1:9052', '--proxy-server=socks5://127.0.0.1:9053', '--proxy-server=socks5://127.0.0.1:9054', '--proxy-server=socks5://127.0.0.1:9055', '--proxy-server=socks5://127.0.0.1:9056', '--proxy-server=socks5://127.0.0.1:9057', '--proxy-server=socks5://127.0.0.1:9058'];
var index       = 0;
const botId     = 0;
puppeteer.use(stealth());

const loadCookie = async (page) => {
    try {
        await fs.access('cookies.json'); // Check if the file exists
        const cookieJson = await fs.readFile('cookies.json');
        const cookies = JSON.parse(cookieJson);
        console.log("[/] setting up cookies.");
        await page.setCookie(...cookies);
        console.log("[+] Cookie logged successfully.");
      } catch (error) {
        console.error('[x] Error setting the cookies:', error);
      }
}

const getTicket = async (page) => {
    try {
        console.log("[/] Getting ticket..");
        await page.click('.e1asqgj30');
        const buttonText = 'Buy ticket';
        const [buttonElement] = await page.$x(`//button[contains(text(), "${buttonText}")]`);
        await buttonElement.click();
        console.log("[+] Tickets Saved !");
        ticket = true;
    } catch(err) {
        console.error("[x] Error while fetching the ticket: ", err);
        ticket = false;
    }
}

function restartJob(browser){

    browser.close();
    if (captcha)
        console.log("[?] Browser closed due to Human verification");
    else
        console.log("[?] Browser closed due to an error")
    console.log("[?] Restarting using another proxy");
    console.log("[?] Retrying..");
    if (index == 7)
        index = 0;
    else
        index++;
    n_run++;
    if (n_run % 20 == 0)
        mailer.send_info('whatablueguy@gmail.com', n_run);
    captcha = false;
}
//<p class="title" id="rtitle" style="visibility: visible; display: block; color: rgb(251, 188, 5);">Human verification in process...</p>
const checkForCaptcha = async (page) => {
    try {
        const elText = 'Human verification in process...';
        const [el] = await page.$x(`//p[contains(text(), "${elText}")]`);
        if (el)
            captcha = true;
        else
            captcha = false;
    } catch (err) {
        console.error("[x] Error while checking for Human verification: ", err);
    }
}

async function setPuppeteer(body)
{
    const start_info    = utils.get_date();
    const start_date    = new Date();
    if (n_run == 1) g_url = body.url;
    var end_info;
    var end_date;

    proxy = proxy_arr[index];
    console.log(`-----------| RUN: ${n_run} BOT: ${botId} |-----------`);
    console.log("[?] Info: Started at: " + start_info);
    console.log("[?] Proxy setup: " + proxy);


    const browser = await puppeteer.launch({
        headless: "new",
        slowMo: 50,
        args: [proxy, '--window-size=1920,1080'],
    });
    const page = (await browser.pages())[0];
    await page.setViewport({
        width: 1920,
        height: 1080,
        deviceScaleFactor: 1,
    });
    await page.setDefaultNavigationTimeout(60000);
    try {
        await page.goto(g_url);
        while (!isAvailable)
        {
            var ticket_button = await page.$('.e1asqgj30');
            if (ticket_button){
                console.log("[+] Ticket found.");
                isAvailable = true;
                await loadCookie(page);
                await page.reload({ waitUntil: ["networkidle0", "domcontentloaded"] });
                await getTicket(page);
            }
            else {  false
                await checkForCaptcha(page);
                if (captcha == true){
                    restartJob(browser);
                    return ticket;
                }
                console.log("[/] No ticket found, reloading...");
                await page.waitForTimeout(utils.getRandomTimeout());
                await page.reload({ waitUntil: ["networkidle0", "domcontentloaded"] });
            }
        }
        if (ticket == true)
        {
            browser.close();
            mailer.send_email('whatablueguy@gmail.com');
            end_info = utils.get_date();
            end_date = new Date();
            var time_diff = utils.getTimeDifference(start_date, end_date);
            console.log("[+] Job done finished at: " + end_info);
            console.log("[?] Performed in: " + time_diff);
            return ticket;
        }
    } catch (err) {
        console.log("[x] Error: " + err);
        return ticket;
    }
}

module.exports = {setPuppeteer};

// actual link: https://www.ticketswap.com/event/live-from-earth-ade-2023/regular-tickets/6de1657f-d678-4e6c-b9f8-12a6ed522516/3058095
// early: https://www.ticketswap.com/event/live-from-earth-ade-2023/early-admission-enter-before-0000/6de1657f-d678-4e6c-b9f8-12a6ed522516/3058099
