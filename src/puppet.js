const puppeteer = require('puppeteer-extra');
const stealth   = require('puppeteer-extra-plugin-stealth');
const fs		= require('fs').promises;
const mailer    = require('./mailer.js');
const utils       = require('./utils.js');

var isAvailable = false;

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
    } catch(err) {
        console.error("[x] Error while fetching the ticket: ", err);
    }
}

async function setPuppeteer()
{
    const start_info = utils.get_date();
    const start_date = new Date();
    var end_info;
    var end_date;

    console.log("[?] Info: Started at: " + start_info);
    puppeteer.use(stealth());
    const browser = await puppeteer.launch({
        headless: false,
        slowMo: 250,
    });
    const page = (await browser.pages())[0];
    
    await loadCookie(page);
    await page.goto("https://www.ticketswap.com/event/ares/1c80c5f7-c1f3-46a6-baba-d4bc99f4190e");
    while (!isAvailable)
    {
        var ticket_button = await page.$('.e1asqgj30');
        if (ticket_button){
            console.log("[+] Ticket found.");
            isAvailable = true;
            await getTicket(page);
        }
        else {
            console.log("[?] No ticket found, reloading...");
            await page.waitForTimeout(15000);
            await page.reload({ waitUntil: ["networkidle0", "domcontentloaded"] });
        }
    }
    browser.close();
    mailer.send_email('whatablueguy@gmail.com');
    //mailer.send_email('');
    end_info = utils.get_date();
    end_date = new Date();
    var time_diff = utils.getTimeDifference(start_date, end_date);
    console.log("[+] Job done finished at: " + end_info);
    console.log("[?] Performed in: " + time_diff);
}

module.exports = {setPuppeteer};

// actual link: https://www.ticketswap.com/event/live-from-earth-ade-2023/regular-tickets/6de1657f-d678-4e6c-b9f8-12a6ed522516/3058095
// good test link: https://www.ticketswap.com/event/ares/1c80c5f7-c1f3-46a6-baba-d4bc99f4190e