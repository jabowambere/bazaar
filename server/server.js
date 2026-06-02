const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const cors = require('cors');
const cookieParser = require('cookie-parser');

dotenv.config();
const app = express();

app.use(cors({ origin: ['http://localhost:5173', 'http://localhost:5000', process.env.CLIENT_ORIGIN].filter(Boolean), credentials: true }));
app.use(express.json());
app.use(cookieParser());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use(express.static(path.join(__dirname, '../frontend')));

app.use('/api', require('./routes/api'));
app.use('/auth', require('./routes/auth'));
app.use('/products', require('./routes/products'));
app.use('/users', require('./routes/users'));
app.use('/cart', require('./routes/cart'));

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ message: 'Server error' });
});

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('MongoDB Connected');
    app.listen(process.env.PORT, () => {
      console.log(`Server running on port ${process.env.PORT}`);
    });
  })
  .catch(err => {
    console.error('Connection error with MongoDB:', err);
    process.exit(1);
  });
