const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Product name is required"],
    unique: true,
    trim: true,
  },
  category: {
    type: String,
    required: [true, "Product category is required"],
  },
  description: {
    type: String,
    required: [true, "Product description is required"],
  },
  image: {
    type: String,
    required: [true, "Product image is required"],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const productModel = mongoose.model("Product", productSchema);
module.exports = productModel;
