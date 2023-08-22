const mongoose = require("mongoose");
const { Schema } = mongoose;
const { symbolModel } = require("./symbolModel");

const symbolDataSchema = new Schema(
  {
    symbol: {
      type: mongoose.Schema.Types.ObjectId,
      ref: symbolModel,
      required: true,
    },
    today: { type: Number, required: true },
    week: { type: Number, required: true },
    month1: { type: Number, required: true },
    months6: { type: Number, required: true },
    YeartoDate: { type: Number, required: true },
    year1: { type: Number, required: true },
    years5: { type: Number, required: true },
    timeAll: { type: Number, required: true },
  },
  {
    timestamps: true,
  }
);

const symbolDataModel = mongoose.model("symbolData", symbolDataSchema);

module.exports = symbolDataModel;
