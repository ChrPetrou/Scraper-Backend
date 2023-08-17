const mongoose = require("mongoose");
const { Schema } = mongoose;

const symbolSchema = new Schema({
  name: { type: String, required: true, unique: true }, // username of the user
  price: { type: String, required: true },
});

const userModel = mongoose.model("user", userSchema);

module.exports = userModel;
