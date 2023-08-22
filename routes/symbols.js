const express = require("express");
require("dotenv").config();
const router = express.Router();
const symbolModel = require("../models/symbolModel");

router.post("/create", async (req, res) => {
  let newSymbol;
  newSymbol = await symbolModel
    .create({
      name: "d",
      symbol: "d",
      price: 1,
      today: 1,
      week: 1,
      month1: 1,
      months6: 1,
      YeartoDate: 1,
      year1: 1,
      years5: 1,
      timeAll: 1,
    })
    .catch((err) => {}); // to catch error

  //   const symbol = newSymbol.toJSON();
  return res.status(200).json({
    message: "succ",
  });
});

module.exports = router;
