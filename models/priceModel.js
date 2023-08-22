const mongoose = require("mongoose");
const { Schema } = mongoose;
const { symbolModel } = require("./symbolModel");

const rateSchema = new Schema(
  {
    symbol: {
      type: mongoose.Schema.Types.ObjectId,
      ref: symbolModel,
      required: true,
    },
    rate: { type: Number, required: true },
  },
  {
    timestamps: true,
  }
);

const rateModel = mongoose.model("rate", rateSchema);

module.exports = rateModel;
