const express=require("express")
const router= express.Router()
const {registeruser,loginuser,testcontrol,forgotpassword}=require("../controllers/user.js")
const {requiresignin,isAdmin}=require("../middleware/auth.js")

router.post("/register",registeruser)
router.post("/login",loginuser)
router.post('/forgotpassword',forgotpassword)
router.get("/test",requiresignin,isAdmin,testcontrol)
router.get("/user-auth",requiresignin,(req,res)=>{
    res.status(200).send({ok:true})
})
router.get("/admin-auth",requiresignin,isAdmin,(req,res)=>{
    res.status(200).send({ok:true})
})

module.exports=router;