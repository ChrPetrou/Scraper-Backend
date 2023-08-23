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
const rateModel = require("./models/exchangeModel");
const performanceModel = require("./models/performanceModel ");

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

      for (const r of result) {
        console.log(r.title, r.rate);
      }

      // result.map(
      //   async (element, index) =>
      //     await symbolModel
      //       .create({
      //         name: element.title,
      //         symbol: element.symbol,
      //       })
      //       .catch((err) => {})
      // );

      result.map(async (element, _) => {
        const symbolId = await symbolModel.find({ symbol: element.symbol });
        // console.log(...symbolId._id);
        await rateModel
          .create({
            symbol: symbolId[0]._id,
            rate: element.rate,
          })
          .catch((err) => {
            console.log(err);
          });
      });
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

      result.map(async (element, _) => {
        const symbolId = await symbolModel.find({ symbol: element.symbol });
        // console.log(...symbolId._id);
        await performanceModel
          .create({
            symbol: symbolId[0]._id,
            today: element.today,
            week: element.week,
            month1: element.month1,
            months6: element.months6,
            YeartoDate: element.datetoYear,
            year1: element.year1,
            years5: element.years5,
            timeAll: element.timeAll,
          })
          .catch((err) => {
            console.log(err);
          });
      });
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
