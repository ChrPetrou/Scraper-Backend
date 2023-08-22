const express = require("express");

require("dotenv").config();
var cors = require("cors");
var puppeteer = require("puppeteer");
const mongoose = require("mongoose");
var CronJob = require("cron").CronJob;
var _ = require("lodash");
const symbols = require("./routes/symbols.js");
const tradingViewService = require("./service/tradingView.service.js");
const symbolModel = require("./models/symbolModel");

const PORT = 4000;

const main = async () => {
  new CronJob(
    "*/10 * * * * *",
    async () => {
      console.log("GETTING RATES");
      const result = await tradingViewService.getRatesForSymbols([
        "EURUSD",
        "GBPUSD",
        "USDJPY",
      ]);

      console.log(result);
    },
    null,
    true,
    "America/Los_Angeles"
  );

  //runs everyday at 6 am
  new CronJob(
    "0 0 6 * * *",
    async () => {
      console.log("GETTING Performance");
      const result = await tradingViewService.getPerformanceForSymbols([
        "EURUSD",
        "GBPUSD",
        "USDJPY",
      ]);

      console.log(result);
    },
    null,
    true,
    "Europe/Athens"
  );

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

main();
