const express=require('express');
const mongoose=require('mongoose');
const dotenv=require('dotenv');
const path=require('path');
const cors=require('cors');

dotenv.config();
const app=express();
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    if (req.method === 'OPTIONS') {
        return res.sendStatus(204);
    }
    next();
});
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'frontend')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'frontend', 'index.html'));
});
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
