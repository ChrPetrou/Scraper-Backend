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
};

module.exports = CronController;
