const express = require('express');
const Cart = require('../models/Cart');
const { protect } = require('../middleware/auth');

const router = express.Router();

// GET user's cart
router.get('/', protect, async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id }).populate('items.product');
    res.status(200).json(cart || { items: [] });
  } catch {
    res.status(500).json({ message: 'Fetching cart failed' });
  }
});

// POST add item to cart
router.post('/add', protect, async (req, res) => {
  try {
    const { productId } = req.body;
    let cart = await Cart.findOne({ user: req.user._id });
    if (!cart) cart = new Cart({ user: req.user._id, items: [] });
    const exists = cart.items.find(i => i.product.toString() === productId);
    if (exists) {
      exists.quantity += 1;
    } else {
      cart.items.push({ product: productId });
    }
    await cart.save();
    await cart.populate('items.product');
    res.status(200).json(cart);
  } catch {
    res.status(500).json({ message: 'Adding to cart failed' });
  }
});

// DELETE remove item from cart
router.delete('/remove/:productId', protect, async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) return res.status(404).json({ message: 'Cart not found' });
    cart.items = cart.items.filter(i => i.product.toString() !== req.params.productId);
    await cart.save();
    await cart.populate('items.product');
    res.status(200).json(cart);
  } catch {
    res.status(500).json({ message: 'Removing from cart failed' });
  }
});

module.exports = router;
