const express = require("express");
require("dotenv").config();
const router = express.Router();
const symbolModel = require("../models/symbolModel");
const rateModel = require("../models/exchangeModel");
const Joi = require("joi");

const latestSchema = Joi.object({
  symbol: Joi.string().required(),
});

const ProgressSchema = Joi.object({
  symbol: Joi.string().required(),
  dateFrom: Joi.number().required(),
  dateTo: Joi.number().required(),
});

router.get("/all-symbols", async (req, res) => {
  let latestsymbol = await symbolModel
    .find({}, { _id: 0, __v: 0, updatedAt: 0 })
    .catch((err) => {
      console.log(err);
    });

  console.log(latestsymbol);

  return res.status(200).json(latestsymbol);
});

router.post("/latest-rate", async (req, res) => {
  const { symbol, error } = latestSchema.validate(req.body);

  if (error) {
    res.status(400).json(error);
    return;
  }

  let latestsymbol = await symbolModel.find({ symbol: symbol }).catch((err) => {
    console.log(err);
  });
  const rate = await rateModel
    .find({ symbol: latestsymbol[0]._id })
    .sort({ createdAt: -1 }) // Sort by descending order of createdAt field
    .limit(1)
    .catch((err) => {
      console.log(err);
    }); // Limit to only one document

  return res.status(200).json(rate[0]);
});

router.post("/progress-rate", async (req, res) => {
  const { value, error } = ProgressSchema.validate(req.body);

  if (error) {
    res.status(400).json(error);
    return;
  }

  const { symbol, dateFrom, dateTo } = value;

  let latestsymbol = await symbolModel.find({ symbol: symbol }).catch((err) => {
    console.log(err);
  });

  const timestampDateFrom = new Date(dateFrom * 1000).toISOString();

  const timestampDateTo = new Date(dateTo * 1000).toISOString();

  const rate = await rateModel
    .find({
      symbol: latestsymbol[0]?._id,
      createdAt: {
        $gt: timestampDateFrom,
        $lte: timestampDateTo,
      },
    })
    .sort({ createdAt: -1 }) // Sort by descending order of createdAt field
    .catch((err) => {
      console.log(err);
    }); // Limit to only one document

  return res.status(200).json(rate);
});

module.exports = router;
