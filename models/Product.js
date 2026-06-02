const mongoose = require('mongoose');
const productSchema = new mongoose.Schema({
  productname: { type: String, required: [true, 'Name is required'], trim: true },
  productprice: { type: Number, required: [true, 'Price is required'], min: [0, 'Price can never be negative'] },
  productdescription: { type: String, trim: true },
  productcategory: { type: String, required: [true, 'Category is required'], trim: true },
  productimage: { type: String, required: [true, 'Product image is required'] },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
}, { timestamps: true });
module.exports = mongoose.model('Product', productSchema);
