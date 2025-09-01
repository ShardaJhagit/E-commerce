const { hashPassword,comparePassword } = require("../encoding/pwd.js");
const User=require("../models/userModel.js")
const JWT=require("jsonwebtoken")

const registeruser= async(req,res)=>{
    const{name,email,password,phonenumber,address,answer}=req.body;

    if(!name|| !email|| !password|| !phonenumber|| !address|| !answer){
        res.status(400);
       throw new Error("Please Enter all the Feilds");
    }

    const userexist=await User.findOne({email})
    if(userexist){
        res.status(400);
       throw new Error("User already exists");
    }
    const hashedPassword=await hashPassword(password)
    

    const user= await User.create({
        name,
        email,
        phonenumber,
        password:hashedPassword,
        address,
        answer,
        
    });
    if(user){
        res.status(201).json({
            _id:user._id,
            name:user.name,
            email:user.email,
            phonenumber:user.phonenumber,
            address:user.address,
            answer:user.answer,
            
            

        })
    }
    else{
        alert("failed")
    }

}


const loginuser=async(req,res)=>{
    const { email, password } = req.body;

  const user = await User.findOne({ email });
  const match= await comparePassword(password,user.password)
  const token = await JWT.sign({_id:user._id},process.env.JWT_SECRET,{expiresIn:"7d",})

  if (user && match) {
    res.status(200).send({
      _id: user._id,
      name: user.name,
      email: user.email,
      phonenumber:user.phonenumber,
      address:user.address,
      pic: user.pic,
      role:user.role,
        token
      
    });

  } else {
    res.status(401);
    res.send("Invalid Email or Password");
  }

}
const forgotpassword= async(req,res)=>{
  try {
    const {email,answer,newPassword}=req.body
    if(!email||!newPassword||!answer){
      res.status(400);
     throw new Error("Please Enter all the Feilds");
  }
   const user=await User.findOne({email,answer})
   if(!user){
    return res.status(404).send({
      success:false,
      message:"wrong email or answer"
    })
   }
   const hashed = await hashPassword(newPassword)
   await User.findByIdAndUpdate(user._id,{password:hashed})
   res.status(200)
.send({
  success:true,
  message:"password reset successfuly"

})    
  } catch (error) {
    console.log(error)
    res.send("something went wrong")
    
  }
}

const testcontrol=(req,res)=>
{
  res.send("protected route")

}
module.exports={registeruser,loginuser,testcontrol,forgotpassword}
