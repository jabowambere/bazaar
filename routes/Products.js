const express=require('express');
const multer=require('multer');
const path=require('path');
const Product=require('../models/Product');

const router=express.Router();

const storage=multer.diskStorage({
    destination:(req, file, cb)=>{
        cb(null, 'uploads/');
    },
    filename:(req, file, cb)=>{
        cb(null, Date.now() + '-' + file.originalname);
    }
});

const upload=multer({
    storage: storage, 
    limits:{fileSize:5*1024*1024}, 
    fileFilter:(req, file, cb)=>{
        const allowedTypes=/jpeg|jpg|png|webp/;
        const extname=allowedTypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype=allowedTypes.test(file.mimetype);
        if(extname&&mimetype){
            return cb(null, true);
        }
        cb(new Error('Only images of type jpeg, jpg, png, webp are allowed!'));
    }
});
const fs=require('fs');
if(!fs.existsSync('uploads')){
    fs.mkdirSync('uploads');
}

router.get('/', async (req, res)=>{
    try{
        const products=await Product.find().sort({createdAt: -1});
        res.status(200).json(products);
    }catch(err){
        res.status(500).json({message: 'Fetching products failed'});
    }
});

router.post('/', upload.single('productimage'), async(req, res)=>{
    try{
        if(!req.file){
            return res.status(400).json({message: 'Please upload an image'});
        }
        const productData={
            ...req.body,
            productimage: `/uploads/${req.file.filename}`
        };
        const product=new Product(productData);
        const savedProduct=await product.save();

        res.status(201).json(savedProduct);
    }catch (err){
        if(err.name === 'ValidationError'){
            return res.status(400).json({message:err.message});
        }
        res.status(500).json({message:'Creating product failed'});
    }
});

router.put('/:id', upload.single('productimage'), async (req, res)=>{
    try{
        const updateData={ ...req.body};
        if(req.file){
            updateData.productimage=`/uploads/${req.file.filename}`;
        }
        const updatedProduct=await Product.findByIdAndUpdate(
            req.params.id,
            updateData,
            {new:true, runValidators:true}
        );
        if(!updatedProduct){
            return res.status(404).json({message:'Product not found'});
        }
        res.status(200).json(updatedProduct);
    }catch(err){
        if(err.name === 'ValidationError'){
            return res.status(400).json({message: err.message});
        }
        res.status(500).json({message:'Updating product failed'});
    }
});

router.delete('/:id', async(req, res)=>{
    try{
        const deletedProduct=await Product.findByIdAndDelete(req.params.id);
        if(!deletedProduct){
            return res.status(404).json({message: 'Product not found'});
        }
        res.status(200).json({message:'Product deleted successfully'});
    }catch(err){
        res.status(500).json({message:'Deleting product failed'});
    }
});
module.exports=router;