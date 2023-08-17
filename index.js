const express = require("express");
var cors = require("cors");
const mongoose = require("mongoose");
const cheerio = require("cheerio");
const axios = require("axios");
require("dotenv").config();
const PORT = 4000;

const main = async () => {
  const app = express();
  app.use(express.json());
  app.use(cors());

  await mongoose.connect(process.env.MONGODB_URI);
  console.log("Connected!");

  app.listen(PORT, (error) => {
    if (!error)
      console.log(
        "Server is Successfully Running, and App is listening on port http://localhost:" +
          PORT
      );
    else console.log("Error occurred, server can't start", error);
  });
};

const url = "https://www.tradingview.com/symbols/EURUSD/?exchange=FX";
const data = [];
const genre = async () => {
  try {
    const response = await axios.get(url);
    const $ = cheerio.load(response.data);
    const symbols = $(".containerWithButton-pAUXADuj");
    symbols.each(function () {
      title = $(this).find("h1").text();
      price = $(this).find("span").text();
      data.push({ title, price });
    });
    console.log(data);
  } catch (error) {}
};

main();
genre();
