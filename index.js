const express = require("express");

require("dotenv").config();
var cors = require("cors");
const mongoose = require("mongoose");
var CronJob = require("cron").CronJob;
var _ = require("lodash");
const symbols = require("./routes/symbols.js");
const rates = require("./routes/rates.js");
const performance = require("./routes/performance.js");
const CronController = require("./controllers/CronController");
const app = express();
const server = require("http").createServer(app);
const WebSocket = require("ws");

const PORT = 4000;

const main = async () => {
  const wss = new WebSocket.Server({ server });

  wss.on("connection", (socket) => {
    console.log("Client connected");
  });

  //  Cron Job for rate
  new CronJob(
    "*/10 * * * * *",
    CronController.GetSymbolRatesAndAddToDb,
    true,
    "America/Los_Angeles"
  );

  new CronJob(
    "*/10 * * * * *",
    () => CronController.SendRatesToConnectedClients(wss),
    null,
    true,
    "America/Los_Angeles"
  );

  //runs everyday at 6 am
  new CronJob(
    "0 0 6 * * *",
    CronController.GetPerformanceRateAndAddToDb,
    null,
    true,
    "Europe/Athens"
  );

  app.use(express.json());

  app.use(cors());

  await mongoose.connect(process.env.MONGODB_URI);
  console.log("Connected to MongoDB");
  app.use("/symbols", symbols);
  app.use("/rates", rates);
  app.use("/performance", performance);
  server.listen(PORT, () => {
    console.log(`Server started on port http://localhost:${PORT}`);
  });
};

main();
