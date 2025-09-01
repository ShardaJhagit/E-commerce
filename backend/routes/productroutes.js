const express=require("express")
const { requiresignin, isAdmin } = require("../middleware/auth")
const { relatedproduct,createProduct,getProduct,productcount,getSingleProduct,productPhoto,deleteProduct,updateProduct, productfilter, productlist, getsearch } = require("../controllers/product")
const formidable = require("express-formidable")


const router= express.Router()
router.post('/create-product',requiresignin,isAdmin,formidable(),createProduct)

router.get("/get-product",getProduct)
router.get("/get-product/:slug",getSingleProduct)
router.get("/product-photo/:pid",productPhoto)
router.delete("/delete-product/:pid",deleteProduct)
router.put("/update-product/:pid",requiresignin,isAdmin,formidable(),updateProduct)


router.post("/product-filter",productfilter)
router.get("/product-count",productcount)
router.get("/product-list/:page",productlist)

router.get("/search/:keyword",getsearch)

router.get("/related-product/:pid/:cid",relatedproduct)

module.exports =router