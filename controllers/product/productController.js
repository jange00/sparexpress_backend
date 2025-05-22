const Product = require("../../models/productModel")

// Create 
exports.createProduct = async (req, res) => {
    try{
        const product = new Product (req.body)
        await product.save()
        return res.status(201).json(
            {
                "success" : true,
                "message" : "Product created successfully",
                "data" : product
            }
        )
    }catch(err){
        return res.status(500).json(
            {
                "success" : false,
                "message" : "Server error"
            }
        )
    }
}

// Read All 
exports.getProducts = async (req, res) => {
    try{
        const products = await Product.find();
        return res.status(200).json(
            {
                "success" : true,
                "message" : "Products fetched",
                "data" : products
            }
        )
    }catch(err){
        return res.status(500).json(
            {
                "success": false,
                "message" : "Server error"
            }
        )
    }
}

// get One
exports.getProductsById = async (req, res) => {
    try{
        const product = await Product.findById(req.params.id)
        if (!product)
            return res.status(404).json({
                "success" : false,
                "message" : "Product not found"
            })
            return res.status(200).json({
                "success" : true,
                "message" : "Product fetched",
                "data" : product
            })
    }catch(err){
        return res.status(500).json(
            {
                "success" : false,
                "message" : "Server error"
            }
        )
    }
}

// Update
exports.updateProduct = async (req,res) => {
    try{
        const product = await Product.findByIdAndUpdate(req.params.id, req.body, {new : true})
        if(!product)
            return res.status(404).json({
                "success" : false,
                "message" : "Product not found"
        })
        return res.status(200).json(
            {
                "success" : true,
                "message" : "Product updated",
                "data" : product
            }
        )
    }catch(err){
        return res.status(500).json(
            {
                "success" : true,
                "message" : "Server error"
            }
        )
    }
}

// Delete
exports.deleteProduct = async (req, res) => {
    try {
      const { id } = req.params;
  
      const product = await Product.findOneAndDelete({
        $or: [
          { _id: id }, // MongoDB ObjectId
          { id: parseInt(id) } // Custom numeric ID
        ]
      });
  
      if (!product)
        return res.status(404).json({ success: false, message: "Product not found" });
  
      return res.status(200).json({ success: true, message: "Product deleted" });
    } catch (err) {
      return res.status(500).json({ success: false, message: "Server error" });
    }
  };
  