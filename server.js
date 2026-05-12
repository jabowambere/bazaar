const express=require('express');
const mongoose=require('mongoose');
const dotenv=require('dotenv');
const path=require('path');

dotenv.config();
const app=express();
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
mongoose.connect(process.env.MONGO_URI)
    .then(()=>{
        console.log("MongoDB Connected");
        app.listen(process.env.PORT, ()=>{
            console.log(`Server running on port ${process.env.PORT}`);
        });
    })
    .catch(err =>{
        console.error('Connection error with MongoDB: ', err);
        process.exit(1);
    });
app.use('/products', require('./routes/products'));
app.use((err, req, res, next)=>{
    console.error(err);
    res.status(500).json({message: 'Server error'});
});