const router = require("express").Router();
const bcrypt = require("bcrypt");

const Product = require("../models/Product");
const {
  verifyToken,
  verifyTokenAndAuthorization,
  verifyTokenAndAdmin,
} = require("./verifyToken");


router.post("/", verifyTokenAndAdmin, async (req,res)=>{
    const newProduct = new Product(req.body)

    try {
        const savedProduct = await newProduct.save()
        res.status(201).json(savedProduct); 
    } catch (error) {
        res.status(500).json(error)
    }
})


// Update product by id
router.put("/update/:id", verifyTokenAndAdmin, async (req, res) => {
  
  try {
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body,
      },
      { new: true }
    );

    res.status(200).json(updatedProduct);
  } catch (error) {
    res.status(500).json(error);
  }
});

//Delete product by id
router.delete("/delete/:id", verifyTokenAndAdmin, async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.status(200).json("Deleted Product");
  } catch (error) {
    res.status(500).json(error);
  }
});

//Get single product by id
router.get("/find/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json(error);
  }
});

// Get all products
router.get("/",  async (req, res) => {
  const qNew = req.query.new;
  const qCategory = req.query.category;
  console.log([qCategory]);
  try {
    let products
    if(qNew){
        products=await Product.find().sort({createdAt:-1}).limit(4)
    }else if(qCategory){
        products = await Product.find({
            categories:{
                $in:[qCategory],
            }
        })
    }else{
        products = await Product.find()
    }
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json(error);
  }
});


module.exports = router;
