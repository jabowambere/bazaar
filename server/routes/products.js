const express = require('express');
const Product = require('../models/Product');
const { protect } = require('../middleware/auth');
const { upload, cloudinary } = require('../cloudinary');

let _io;
const router = express.Router();
router.setIo = (io) => { _io = io; };

const isOwnerOrAdmin = (product, user) => {
  if (user.role === 'admin') return true;
  if (!product.owner) return true;
  return product.owner.toString() === user._id.toString();
};

const getPublicId = (url) => {
  if (!url || url.startsWith('/uploads')) return null;
  const parts = url.split('/');
  const file = parts[parts.length - 1].split('.')[0];
  return `producthub/${file}`;
};

// GET all products
router.get('/', async (req, res) => {
  try {
    const products = await Product.find().populate('owner', 'name').sort({ createdAt: -1 });
    res.status(200).json(products);
  } catch {
    res.status(500).json({ message: 'Fetching products failed' });
  }
});

// GET my products
router.get('/mine', protect, async (req, res) => {
  try {
    const products = await Product.find({ owner: req.user._id }).populate('owner', 'name').sort({ createdAt: -1 });
    res.status(200).json(products);
  } catch {
    res.status(500).json({ message: 'Fetching your products failed' });
  }
});

// POST create product
router.post('/', protect, upload.single('productimage'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'Please upload an image' });
    const product = new Product({
      ...req.body,
      productimage: req.file.path,
      owner: req.user._id
    });
    const saved = await product.save();
    await saved.populate('owner', 'name');
    _io?.emit('productActivity', { action: 'added', productName: saved.productname, by: req.user.name });
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
    if (req.file) {
      const oldId = getPublicId(product.productimage);
      if (oldId) await cloudinary.uploader.destroy(oldId).catch(() => {});
      updateData.productimage = req.file.path;
    }
    const updated = await Product.findByIdAndUpdate(req.params.id, updateData, { new: true, runValidators: true });
    _io?.emit('productActivity', { action: 'updated', productName: updated.productname, by: req.user.name });
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
    const oldId = getPublicId(product.productimage);
    if (oldId) await cloudinary.uploader.destroy(oldId).catch(() => {});
    await Product.findByIdAndDelete(req.params.id);
    _io?.emit('productActivity', { action: 'deleted', productName: product.productname, by: req.user.name });
    res.status(200).json({ message: 'Product deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Deleting product failed', error: err.message });
  }
});

module.exports = router;
