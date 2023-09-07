const express = require("express");
require("dotenv").config();
const router = express.Router();
const performanceModel = require("../models/performanceModel");
const symbolModel = require("../models/symbolModel");
const Joi = require("joi");

const performanceSchema = Joi.object({
  symbol: Joi.string().required(),
});

router.get("/", async (req, res) => {
  const { value, error } = performanceSchema.validate(req.query);
  const { symbol } = value;
  if (error) {
    res.status(400).json(error);
    return;
  }

  let latestsymbol = await symbolModel.find({ symbol: symbol }).catch((err) => {
    console.log(err);
  });

  const performanceRate = await performanceModel
    .find({ symbol: latestsymbol[0]?._id })
    .select("today week month1 months6 dateToYear year1 years5 timeAll -_id")
    .sort({ createdAt: -1 }) // Sort by descending order of createdAt field
    .limit(1)
    .catch((err) => {
      console.log(err);
    }); // Limit to only one document

  return res.status(200).json(performanceRate[0]);
});

module.exports = router;
