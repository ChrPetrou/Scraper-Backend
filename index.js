const express = require("express");

require("dotenv").config();
var cors = require("cors");
var puppeteer = require("puppeteer");
const mongoose = require("mongoose");
var CronJob = require("cron").CronJob;
var _ = require("lodash");
const symbols = require("./routes/symbols.js");

const PORT = 4000;

const main = async () => {
  var job = new CronJob(
    "*/10 * * * * *",
    generic,
    null,
    true,
    "America/Los_Angeles"
  );
  job.start();
  const app = express();
  app.use(express.json());

  app.use(cors());

  await mongoose.connect(process.env.MONGODB_URI);
  console.log("Connected to MongoDB");
  app.use("/symbols", symbols);

  app.listen(PORT, () => {
    console.log(`Server started on port http://localhost:${PORT}`);
  });
};

const generic = async () => {
  const browser = await puppeteer.launch({
    headless: "new",
    args: ["--window-size=1920,1040"], //open page with this dimensions
    defaultViewport: null,
  });
  const [page1, page2, page3] = await Promise.all([
    browser.newPage(),
    browser.newPage(),
    browser.newPage(),
  ]);

  const results = await Promise.all([
    get(
      page1,
      "https://www.tradingview.com/symbols/EURUSD/?exchange=FX",
      "EURUSD"
    ),
    get(
      page2,
      "https://www.tradingview.com/symbols/GBPUSD/?exchange=FX",
      "GBPUSD"
    ),
    get(
      page3,
      "https://www.tradingview.com/symbols/USDJPY/?exchange=FX",
      "USDJPY"
    ),
  ]);

  console.log(results[0]);

  async function get(page, url, symbol) {
    await page.setViewport({ width: 1080, height: 1024 });
    await page.goto(url);

    // console.log("wait");

    await page.waitForSelector(
      ".container-pAUXADuj.containerWithButton-pAUXADuj h1"
    );

    const title = await page.$eval(
      ".container-pAUXADuj.containerWithButton-pAUXADuj h1",
      (el) => {
        return el.innerText;
      }
    );
    // console.log(title);

    await page.waitForSelector(".lastContainer-JWoJqCpY span");

    const result = await page.$$eval(".lastContainer-JWoJqCpY span", (el) => {
      return el[0].innerText;
    });
    // console.log(result);

    await page.waitForSelector(".block-sjmalUvv button");

    let prog = await page.$$eval(".block-sjmalUvv button", (el) => {
      return Array.from(el).map((x) => x.innerText);
    });
    prog = prog.map((x) => {
      return [
        _.camelCase(x.split("\n")[0].split(" ").reverse().join("")),
        parseFloat(x.split("\n")[1].replace("−", "-").split("%")[0] / 100),
      ];
    });
    prog = Object.fromEntries(prog);

    return { title, result: parseFloat(result), ...prog, symbol };
  }

  await browser.close();
};

main();
