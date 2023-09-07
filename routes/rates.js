const express = require("express");
require("dotenv").config();
const router = express.Router();
const rateModel = require("../models/exchangeModel");
const symbolModel = require("../models/symbolModel");
const Joi = require("joi");

const latestSchema = Joi.object({
  symbol: Joi.string().required(),
});

const ProgressSchema = Joi.object({
  symbol: Joi.string().required(),
  dateFrom: Joi.number().required(),
  dateTo: Joi.number().required(),
});

router.get("/latest", async (req, res) => {
  console.log(req.query);
  const { value, error } = latestSchema.validate(req.query);
  const { symbol } = value;
  if (error) {
    res.status(400).json(error);
    return;
  }

  let latestsymbol = await symbolModel.find({ symbol: symbol }).catch((err) => {
    console.log(err);
  });

  const rate = await rateModel
    .find({ symbol: latestsymbol[0]?._id })
    .sort({ createdAt: -1 }) // Sort by descending order of createdAt field
    .limit(1)
    .catch((err) => {
      console.log(err);
    }); // Limit to only one document

  return res.status(200).json(rate[0]);
});

router.get("/history", async (req, res) => {
  const { value, error } = ProgressSchema.validate(req.query);

  if (error) {
    res.status(400).json(error);
    return;
  }

  const { symbol, dateFrom, dateTo } = value;

  let latestsymbol = await symbolModel
    .find({ symbol: symbol })
    .catch((err) => {
      console.log(err);
    })
    .catch((err) => {
      console.log(err);
    }); // Limit to only one document;

  const timestampDateFrom = new Date(dateFrom * 1000).toISOString();

  const timestampDateTo = new Date(dateTo * 1000).toISOString();

  const timestampDifference = dateTo - dateFrom;

  switch (timestampDifference) {
    case timestampDifference < 604800:
      console.log("hi");
      break;
    default:
      break;
  }
  let timediff = 60;
  if (timestampDifference < 604800) {
    //today
    timediff = 60;
    console.log("today");
  } else if (timestampDifference < 2678400) {
    //week
    timediff = 60 * 15;
    console.log("week");
  } else if (timestampDifference < 15894000) {
    //month
    timediff = 60 * 30;
    console.log("month");
  } else if (timestampDifference < 21573392) {
    //6 monhts
    timediff = 60 * 60 * 2;
    console.log("montsh");
  } else if (timestampDifference < 31536001) {
    // start of year
    timediff = 60 * 60 * 24;
    console.log("start");
  } else if (timestampDifference < 157766401) {
    //1 year before
    timediff = 60 * 60 * 24;
    console.log("year");
  } else if (timestampDifference < 1694097410) {
    // 5 years
    timediff = 60 * 60 * 24 * 7;
    console.log("years");
  } else {
    //all time
    timediff = 60 * 60 * 24 * 31;
    console.log("all");
  }

  console.log("timestamp", timestampDifference);
  console.log("diff", timediff);

  const rate = await rateModel
    .find({
      symbol: latestsymbol[0]?._id,
      createdAt: {
        $gt: timestampDateFrom,
        $lte: timestampDateTo,
      },
    })
    .sort({ createdAt: 1 }) // Sort by ascending order of createdAt field
    .catch((err) => {
      console.log(err);
    }); // Limit to only one document

  const filteredRate = [];
  let currentTimestamp = Math.floor(
    new Date(rate[0]?.createdAt).getTime() / 1000
  );

  for (const item of rate) {
    const itemTimestamp = Math.floor(new Date(item.createdAt).getTime() / 1000);
    if (itemTimestamp >= currentTimestamp) {
      filteredRate.push(item);

      const created_at = new Date(item.createdAt).toLocaleString("en-US", {
        day: "numeric",
        hour: "numeric",
        minute: "numeric",
        month: "long",
      });
      currentTimestamp += timediff;
    }
  }
  return res
    .status(200)
    .json(
      filteredRate.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
    );
});

module.exports = router;