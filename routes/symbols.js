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

  // const exchangeRate = rate.toJSON();
  return res.status(200).json(rate[0]);
});

router.post("/perfrormance-rate", async (req, res) => {
  const { symbol, dateFrom, dateTo, error } = latestSchema.validate(req.body);

  if (error) {
    res.status(400).json(error);
    return;
  }

  let latestsymbol = await symbolModel.find({ symbol: symbol }).catch((err) => {
    console.log(err);
  });
  const dateOptions = {
    timeZone: "UTC",
    month: "long",
    day: "numeric",
    year: "numeric",
  };

  let gteDate, ltDate;

  switch (time) {
    case "today": {
      console.log("today");
      gteDate = new Date(); //.toISOString().split("T")[0];
      ltDate = new Date(gteDate);
      ltDate.setDate(gteDate.getDate() + 1);
      gteDate = gteDate.toISOString().split("T")[0];
      ltDate = ltDate.toISOString().split("T")[0];
    }
    case "week": {
      console.log("week");
      gteDate = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
      ltDate = new Date();
      ltDate.setDate(ltDate.getDate() + 1);
      gteDate = gteDate.toISOString().split("T")[0];
      ltDate = ltDate.toISOString().split("T")[0];
      break;
    }
    case "month": {
      console.log("month");
      gteDate = new Date(); //.toISOString().split("T")[0];
      const month = gteDate.getMonth();
      gteDate;
      ltDate = new Date(gteDate);
      ltDate.setDate(gteDate.getDate() + 1);
      gteDate = gteDate.toISOString().split("T")[0];
      ltDate = ltDate.toISOString().split("T")[0];
      break;
    }
    case "months": {
      console.log("months");
      gteDate = new Date(); //.toISOString().split("T")[0];
      ltDate = new Date(gteDate);
      ltDate.setDate(gteDate.getDate() + 1);
      gteDate = gteDate.toISOString().split("T")[0];
      ltDate = ltDate.toISOString().split("T")[0];
      break;
    }

    case "year": {
      gteDate = new Date(); //.toISOString().split("T")[0];
      ltDate = new Date(gteDate);
      ltDate.setDate(gteDate.getDate() + 1);
      gteDate = gteDate.toISOString().split("T")[0];
      ltDate = ltDate.toISOString().split("T")[0];
      break;
    }
    case "years": {
      gteDate = new Date(); //.toISOString().split("T")[0];
      ltDate = new Date(gteDate);
      ltDate.setDate(gteDate.getDate() + 1);
      gteDate = gteDate.toISOString().split("T")[0];
      ltDate = ltDate.toISOString().split("T")[0];
      break;
    }
    default:
      break;
  }
  console.log(time, gteDate, ltDate);

  dateFrom = new Date(timestampFrom);
  dateTo = new Date(timestampTo);
  const rate = await rateModel
    .find({
      symbol: latestsymbol[0]._id,
      createdAt: { $gte: dateFrom, $lte: dateTo },
    })
    .sort({ createdAt: -1 }) // Sort by descending order of createdAt field
    .catch((err) => {
      console.log(err);
    }); // Limit to only one document

  // const exchangeRate = rate.toJSON();
  return res.status(200).json(rate);
});

module.exports = router;
