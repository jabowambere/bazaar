const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const Product = require('../models/Product');
const User = require('../models/User');

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, path.join(__dirname, '../uploads/')),
  filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname)
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowed = /jpeg|jpg|png|webp/;
    if (allowed.test(path.extname(file.originalname).toLowerCase()) && allowed.test(file.mimetype))
      return cb(null, true);
    cb(new Error('Only jpeg, jpg, png, webp images are allowed'));
  }
});

// GET all products
router.get('/products', async (req, res) => {
  try {
    const products = await Product.find().populate('owner', 'name').sort({ createdAt: -1 });
    res.status(200).json(products);
  } catch {
    res.status(500).json({ message: 'Fetching products failed' });
  }
});

// POST create product (uses a default/guest owner)
router.post('/products', upload.single('productimage'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'Please upload an image' });
    let owner = await User.findOne({ role: 'admin' });
    if (!owner) return res.status(500).json({ message: 'No admin user found to assign as owner' });
    const product = new Product({
      ...req.body,
      productimage: `/uploads/${req.file.filename}`,
      owner: owner._id
    });
    const saved = await product.save();
    await saved.populate('owner', 'name');
    res.status(201).json(saved);
  } catch (err) {
    if (err.name === 'ValidationError') return res.status(400).json({ message: err.message });
    res.status(500).json({ message: 'Creating product failed' });
  }
});

// PUT update product
router.put('/products/:id', upload.single('productimage'), async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    const updateData = { ...req.body };
    if (req.file) updateData.productimage = `/uploads/${req.file.filename}`;
    const updated = await Product.findByIdAndUpdate(req.params.id, updateData, { new: true, runValidators: true });
    res.status(200).json(updated);
  } catch (err) {
    if (err.name === 'ValidationError') return res.status(400).json({ message: err.message });
    res.status(500).json({ message: 'Updating product failed' });
  }
});

// DELETE product
router.delete('/products/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    await Product.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Product deleted successfully' });
  } catch {
    res.status(500).json({ message: 'Deleting product failed' });
  }
});

module.exports = router;
