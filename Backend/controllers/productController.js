const productModel = require("../models/Product");

// Create Product
exports.createProduct = async (req, res, next) => {
  try {
    const { name, category, description } = req.body;
    const image = req.file ? `/uploads/${req.file.filename}` : null;

    if (!name || !category || !description || !image) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existing = await productModel.findOne({ name });
    if (existing)
      return res.status(409).json({ message: "Product already exists" });

    const product = await productModel.create({
      name,
      category,
      description,
      image: req.file ? req.file.path : "",
    });


    res.status(201).json(product);
  } catch (error) {
    next(error);
  }
};

// Update Product
exports.updateProduct = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, category, description } = req.body;
    const image = req.file ? `/uploads/${req.file.filename}` : undefined;

    if (!name || !category || !description) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existing = await productModel.findOne({ name, _id: { $ne: id } });
    if (existing)
      return res.status(409).json({ message: "Product name exists" });

    const updateData = { name, category, description };
    if (image) updateData.image = image;

    const product = await productModel.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!product) return res.status(404).json({ message: "Product not found" });

    res.json(product);
  } catch (error) {
    next(error);
  }
};

// Get All Products
exports.getProducts = async (req, res, next) => {
  try {
    const products = await productModel.find();
    res.json(products);
  } catch (error) {
    next(error);
  }
};

// Delete Product
exports.deleteProduct = async (req, res, next) => {
  try {
    const { id } = req.params;
    const product = await productModel.findByIdAndDelete(id);
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json({ message: "Product deleted" });
  } catch (error) {
    next(error);
  }
};
