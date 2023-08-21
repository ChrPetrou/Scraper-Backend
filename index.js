const express = require("express");

require("dotenv").config();
var cors = require("cors");
var puppeteer = require("puppeteer");
const mongoose = require("mongoose");

const PORT = 4000;

const main = async () => {
  const app = express();
  app.use(express.json());

  app.use(cors());

  await mongoose.connect(process.env.MONGODB_URI);
  console.log("Connected!");

  app.listen(PORT, () => {
    setInterval(generic, 60);

    console.log(`Server started on port http://localhost:${PORT}`);
  });
};

const generic = async () => {
  const browser = await puppeteer.launch({
    headless: false,
    args: ["--window-size=1920,1040"], //open page with this dimensions
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 1080, height: 1024 });
  await page.goto("https://www.tradingview.com/symbols/EURUSD/?exchange=FX");

  console.log("wait");

  await page.waitForSelector(
    ".container-pAUXADuj.containerWithButton-pAUXADuj h1"
  );

  const title = await page.$eval(
    ".container-pAUXADuj.containerWithButton-pAUXADuj h1",
    (el) => {
      return el.innerText;
    }
  );
  console.log(title);

  await page.waitForSelector(".lastContainer-JWoJqCpY span");

  const result = await page.$$eval(".lastContainer-JWoJqCpY span", (el) => {
    return el[0].innerText;
  });
  console.log(result);

  await page.waitForSelector(".block-sjmalUvv button");

  const prog = await page.$$eval(".block-sjmalUvv button", (el) => {
    return Array.from(el).map((x) => x.innerText.replace("\n", "- "));
  });
  console.log(prog);
};

const generic2 = async () => {
  const browser = await puppeteer.launch({
    headless: false,
    args: ["--window-size=1920,1040"], //open page with this dimensions
    defaultViewport: null,
  });

  const page = await browser.newPage();
  await page.goto("https://www.tradingview.com/symbols/EURUSD/?exchange=FX");

  console.log("wait");
  const names = await page.evaluate(() => {
    // return Array.from(document.querySelectorAll(".info strong")).map(
    //   (x) => x.textContent
    // );
    return Array.from(
      document.querySelectorAll(".lastContainer-JWoJqCpY span")
    ).map((x) => x.textContent);
    // return document
    //   .querySelectorAll(".js-symbol-header-ticker .quote-ticker-inited span")
    //   .values((x) => x.textContent);
  });
  console.log(names);

  console.log("ended");
  //   await page.screenshot({ path: "amazing.png" });
  //   await browser.close();
};

main();
