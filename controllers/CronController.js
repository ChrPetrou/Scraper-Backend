const tradingViewService = require("../service/tradingView.service");
const symbolModel = require("../models/symbolModel");
const rateModel = require("../models/exchangeModel");
const performanceModel = require("../models/performanceModel");
const WebSocket = require("ws");

const CronController = {
  GetSymbolRatesAndAddToDb: async () => {
    const result = await tradingViewService.getRatesForSymbols([
      "EURUSD",
      "GBPUSD",
      "USDJPY",
    ]);

    result.map(async (element, _) => {
      const symbolId = await symbolModel.find({ symbol: element.symbol });

      await rateModel
        .create({
          symbol: symbolId[0]._id,
          rate: element.rate,
        })
        .catch((err) => {
          console.error(err);
        });
    });
  },
  SendRatesToConnectedClients: async (wss) => {
    const result = await tradingViewService.getRatesForSymbols([
      "EURUSD",
      "GBPUSD",
      "USDJPY",
    ]);

    result.map(async (element, _) => {
      const symbolId = await symbolModel.find({ symbol: element.symbol });
      const rate = await rateModel
        .find({ symbol: symbolId[0]?._id })
        .sort({ createdAt: -1 }) // Sort by descending order of createdAt field
        .limit(1)
        .catch((err) => {
          console.log(err);
        }); // Limit to only one document

      //sent message to user each circle of cron job
      wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
          const dataUpdate = {
            type: "update",
            message: {
              symbol: element.symbol,
              rate: rate[0].rate,
              createdAt: rate[0].createdAt,
            },
          };
          client.send(JSON.stringify(dataUpdate));
        }
      });
    });
  },
  GetPerformanceRateAndAddToDb: async () => {
    const result = await tradingViewService.getPerformanceForSymbols([
      "EURUSD",
      "GBPUSD",
      "USDJPY",
    ]);

    result.map(async (element, _) => {
      const symbolId = await symbolModel.find({ symbol: element.symbol });

      await performanceModel
        .create({
          symbol: symbolId[0]._id,
          today: element.today,
          week: element.week,
          month1: element.month1,
          months6: element.months6,
          dateToYear: element.datetoYear,
          year1: element.year1,
          years5: element.years5,
          timeAll: element.timeAll,
        })
        .catch((err) => {
          console.error(err);
        });
    });
  },
};

module.exports = CronController;
