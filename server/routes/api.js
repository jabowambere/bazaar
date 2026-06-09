const express = require('express');
const Product = require('../models/Product');
const User = require('../models/User');
const { upload, cloudinary } = require('../cloudinary');

const router = express.Router();

const getPublicId = (url) => {
  if (!url || url.startsWith('/uploads')) return null;
  const parts = url.split('/');
  const file = parts[parts.length - 1].split('.')[0];
  return `producthub/${file}`;
};

// GET all products
router.get('/products', async (req, res) => {
  try {
    const products = await Product.find().populate('owner', 'name').sort({ createdAt: -1 });
    res.status(200).json(products);
  } catch {
    res.status(500).json({ message: 'Fetching products failed' });
  }
});

// POST create product
router.post('/products', upload.single('productimage'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'Please upload an image' });
    let owner = await User.findOne({ role: 'admin' });
    if (!owner) return res.status(500).json({ message: 'No admin user found' });
    const product = new Product({
      ...req.body,
      productimage: req.file.path,
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
    if (req.file) {
      const oldId = getPublicId(product.productimage);
      if (oldId) await cloudinary.uploader.destroy(oldId).catch(() => {});
      updateData.productimage = req.file.path;
    }
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
    const oldId = getPublicId(product.productimage);
    if (oldId) await cloudinary.uploader.destroy(oldId).catch(() => {});
    await Product.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Product deleted successfully' });
  } catch {
    res.status(500).json({ message: 'Deleting product failed' });
  }
});

module.exports = router;
