const db=require("./config/db")
const express = require("express")
const colors = require("colors")
const dotenv = require("dotenv")
const userRoutes= require("./routes/userroutes")
const categoryRoutes= require("./routes/categoryroutes")
const productRoutes=require("./routes/productroutes")
const cors = require("cors")

const PORT = process.env.PORT || 8060
dotenv.config()
const app = express()

db();

app.use(cors())
app.get("/",(req,res)=>{
    res.send("api is running")
})
app.use(express.json())
app.use("/user",userRoutes)
app.use("/category",categoryRoutes)
app.use("/product",productRoutes)


app.listen(PORT,()=>{
    console.log("server start".bgRed.white)
})
