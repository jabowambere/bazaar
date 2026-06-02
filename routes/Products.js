const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const Product = require('../models/Product');
const { protect } = require('../middleware/auth');

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
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

if (!fs.existsSync('uploads')) fs.mkdirSync('uploads');

const isOwnerOrAdmin = (product, user) => {
  if (user.role === 'admin') return true;
  if (!product.owner) return true;
  return product.owner.toString() === user._id.toString();
};

// GET all products (public)
router.get('/', async (req, res) => {
  try {
    const products = await Product.find().populate('owner', 'name').sort({ createdAt: -1 });
    res.status(200).json(products);
  } catch {
    res.status(500).json({ message: 'Fetching products failed' });
  }
});

// GET my products only
router.get('/mine', protect, async (req, res) => {
  try {
    const products = await Product.find({ owner: req.user._id }).populate('owner', 'name').sort({ createdAt: -1 });
    res.status(200).json(products);
  } catch {
    res.status(500).json({ message: 'Fetching your products failed' });
  }
});

// POST create product (auth required)
router.post('/', protect, upload.single('productimage'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'Please upload an image' });
    const product = new Product({
      ...req.body,
      productimage: `/uploads/${req.file.filename}`,
      owner: req.user._id
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
router.put('/:id', protect, upload.single('productimage'), async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    if (!isOwnerOrAdmin(product, req.user)) return res.status(403).json({ message: 'Not authorized' });
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
router.delete('/:id', protect, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    if (!isOwnerOrAdmin(product, req.user)) return res.status(403).json({ message: 'Not authorized' });
    await Product.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Product deleted successfully' });
  } catch (err) {
    console.error('Delete error:', err);
    res.status(500).json({ message: 'Deleting product failed', error: err.message });
  }
});

module.exports = router;
