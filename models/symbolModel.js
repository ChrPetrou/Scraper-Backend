const mongoose = require("mongoose");
const { Schema } = mongoose;

const symbolSchema = new Schema(
  {
    name: { type: String, required: true, unique: true }, // username of the user
    symbol: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

const symbolModel = mongoose.model("symbols", symbolSchema);

module.exports = symbolModel;
