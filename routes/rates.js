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
  const timestamp = (dateTo - dateFrom) / 100;
  console.log(timestamp);
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
  // console.log(rate);
  return res.status(200).json(rate);
});

module.exports = router;
