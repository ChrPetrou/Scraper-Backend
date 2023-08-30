const express = require("express");
require("dotenv").config();
const router = express.Router();
const symbolModel = require("../models/symbolModel");

router.get("/", async (req, res) => {
  let latestsymbol = await symbolModel
    .find({}, { _id: 0, __v: 0, updatedAt: 0 })
    .catch((err) => {
      console.log(err);
    });

  return res.status(200).json(latestsymbol);
});

module.exports = router;
