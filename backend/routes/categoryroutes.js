const express=require("express")
const {createcategory,updatecategory,allcategory,singlecategory,deletecategory}=require("../controllers/category")
const { requiresignin, isAdmin } = require("../middleware/auth")
const router= express.Router()

router.post("/create-category",requiresignin,isAdmin,createcategory)
router.put("/update-category/:id",requiresignin,isAdmin,updatecategory)
router.get("/categories",allcategory)
router.get("/single-category/:slug",singlecategory)
router.get("/delete-category/:id",requiresignin,isAdmin,deletecategory)


module.exports =router