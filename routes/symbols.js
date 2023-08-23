const express = require("express");
require("dotenv").config();
const router = express.Router();
const symbolModel = require("../models/symbolModel");
const rateModel = require("../models/exchangeModel");

router.post("/latest-rate", async (req, res) => {
  const { symbol } = req.body;
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

  // const exchangeRate = rate.toJSON();
  return res.status(200).json(rate[0]);
});

module.exports = router;
