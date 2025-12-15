const express = require("express");
const router = express.Router();
const multer = require("multer");
const {
  createProduct,
  getProducts,
  updateProduct,
  deleteProduct,
} = require("../controllers/productController");

// Multer config
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});
const upload = multer({ storage, limits: { fileSize: 1.3 * 1024 * 1024 } }); // 1.3MB limit

router.post("/products", upload.single("imageFile"), createProduct);
router.get("/products", getProducts);
router.put("/products/:id", upload.single("imageFile"), updateProduct);
router.delete("/products/:id", deleteProduct);

module.exports = router;
