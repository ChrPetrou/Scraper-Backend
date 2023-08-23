const mongoose = require("mongoose");
const { Schema } = mongoose;
const symbolModel = require("./symbolModel");

const performanceSchema = new Schema(
  {
    symbol: {
      type: mongoose.Schema.Types.ObjectId,
      ref: symbolModel.modelName,
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

const performanceModel = mongoose.model("performance", performanceSchema);

module.exports = performanceModel;
