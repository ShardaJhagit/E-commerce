const moongoose= require("mongoose")



const userModel = moongoose.Schema({
    name:{type:String,required:true},
    phonenumber:{type:Number,required:true},
    email:{type:String,required:true,unique:true},
    address:{type:String,required:true},
    password:{type:String,required:true},
    answer:{type:String,required:true},
    role:{type:Number,default:0},
     
},
{
    timestamps:true,
});



  
const User=moongoose.model("User",userModel)

module.exports=User;