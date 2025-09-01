const Product = require("../models/productModel");
const slugify = require("slugify");
const fs = require("fs");

const createProduct = async (req, res) => {
  try {
    const { name, slug, description, price, category, quantity, shipping } =
      req.fields;
    const { photo } = req.files;
    if (!name || !description || !price || !category || !quantity) {
      return res.status(500).send({ error: "All feilds required" });
    }
    if (photo && photo.size > 1000000) {
      return res.status(500).send({ error: " Photo is required" });
    }
    const products = await Product({ ...req.fields, slug: slugify(name) });
    if (photo) {
      products.photo.data = fs.readFileSync(photo.path);
      products.photo.contentType = photo.type;
    }
    await products.save();
    res.status(201).send({
      success: true,
      message: "Product Created Successfully",
      products,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in creating the products",
    });
  }
};

const getProduct = async (req, res) => {
  try {
    const products = await Product
      .find({})
      .populate("category")
      .select("-photo")
      .limit(12)
      .sort({ createdAt: -1 });
    res.status(200).send({
      success: true,
      counTotal: products.length,
      message: "ALlProducts ",
      products,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Erorr in getting products",
      error: error.message,
    });
  }
};

const getSingleProduct = async (req, res) => {
  try {
    const product = await Product
      .findOne({ slug: req.params.slug })
      .select("-photo")
      .populate("category");
    res.status(200).send({
      success: true,
      message: "Single Product Fetched",
      product,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Eror while getitng single product",
      error,
    });
  }
};

const productPhoto = async (req, res) => {
  try {
    const product = await Product.findById(req.params.pid).select("photo");
    if (product.photo.data) {
      res.set("Content-type", product.photo.contentType);
      return res.status(200).send(product.photo.data);
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Erorr while getting photo",
      error,
    });
  }
};

const deleteProduct = async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.pid).select("-photo");
    res.status(200).send({
      success: true,
      message: "Product Deleted successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error while deleting product",
      error,
    });
  }
};

const updateProduct = async (req, res) => {
  try {
    const { name, description, price, category, quantity, shipping } =
      req.fields;
    const { photo } = req.files;
    //alidation
    switch (true) {
      case !name:
        return res.status(500).send({ error: "Name is Required" });
      case !description:
        return res.status(500).send({ error: "Description is Required" });
      case !price:
        return res.status(500).send({ error: "Price is Required" });
      case !category:
        return res.status(500).send({ error: "Category is Required" });
      case !quantity:
        return res.status(500).send({ error: "Quantity is Required" });
      case photo && photo.size > 1000000:
        return res
          .status(500)
          .send({ error: "photo is Required and should be less then 1mb" });
    }

    const products = await Product.findByIdAndUpdate(
      req.params.pid,
      { ...req.fields, slug: slugify(name) },
      { new: true }
    );
    if (photo) {
      products.photo.data = fs.readFileSync(photo.path);
      products.photo.contentType = photo.type;
    }
    await products.save();
    res.status(201).send({
      success: true,
      message: "Product Updated Successfully",
      products,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: "Error in Updte product",
    });
  }
};

const productfilter=async(req,res)=>{
  try {
    const {checked,radio}=req.body
    let args={}
    if(checked.length>0) args.category=checked
    if(radio.length>0) args.price={$gte:radio[0],$lte:radio[1]}
    const products=await Product.find(args)
    res.status(200).send({
      success:true,
      products
    })
  } catch (error) {
    res.status(400).send({
      success:false,
      message:"error while filtering products"
    })
  }

}

const productcount=async (req,res)=>{
  try {
    const total= await Product.find({}).estimatedDocumentCount()
    res.status(200).send({
      success:true,
      total,
    })
    
  } catch (error) {
    console.log(error)
    res.status(400).send({
      message:"Error in product count",
      error,
      success:false 
    })
  }

}

const productlist = async(req,res)=>{
  try {
    const perpage=2
    const page=req.params.page ? req.params.page:1
    const products=await Product.find({}).select("-photo")
    .skip((page-1)*perpage)
    .limit(perpage)
    .sort({createdAt:-1})
    res.status(200).send({
      success:true,
      products,
    })    
  } catch (error) {
    console.log(error)
    res.status(400).send({
      message:"Error in per product ",
      error,
      success:false 
    })
    
    

  }
}

const getsearch =async(req,res)=>{
  try {
    const {keyword}=req.params;
    const results = await Product.find({
      $or:[
        {name:{$regex:keyword,$options:"i"}},
        {description:{$regex:keyword,$options:"i"}}
      ],
    }).select("-photo");
    res.json(results);
  } catch (error) {
    console.log(error)
    res.status(400).send({
      message:"Error in search product ",
      error,
      success:false 
    })
    
  }

}

const relatedproduct=async(req,res)=>{
   try {
    const {pid,cid}=req.params;
    const products = await Product.find({
      category:cid,
      _id:{$ne:pid},
    }).select("-photo")
    .limit(3)
    .populate("category");
    res.status(200).send({
      success:true,
      products,
    })

    
   } catch (error) {
    console.log(error)
    res.status(400).send({
      message:"Error in search product ",
      error,
      success:false 
    })
   }
}

module.exports = { relatedproduct,getsearch,createProduct,productlist, getProduct, productcount,getSingleProduct, productPhoto,deleteProduct,updateProduct,productfilter };
