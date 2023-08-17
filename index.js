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
    generic();

    console.log(`Server started on port http://localhost:${PORT}`);
  });
};

const generic = async () => {
  const browser = await puppeteer.launch({
    headless: false,
  });

  const page = await browser.newPage();
  await page.goto("https://www.tradingview.com/symbols/EURUSD/?exchange=FX");

  console.log("wait");
  await page.waitForSelector(".js-symbol-last");
  console.log("ddadas");
  await page.$$eval("span.js-symbol-last", (el) => {
    console.log("found");
    console.log(el[0]);
  });

  console.log("ended");
  //   await page.screenshot({ path: "amazing.png" });
  //   await browser.close();
};

main();
