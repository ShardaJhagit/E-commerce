const mongoose =require("mongoose")

const client = async ()=>{
    try {
        const conn = await mongoose.connect(process.env.MONGO_URL, {
          useNewUrlParser: true,
          useUnifiedTopology: true,
          
        });
    
        console.log(`MongoDB Connected: ${conn.connection.host}`);
      } catch (error) {
        console.log(`Error: ${error}`);
        process.exit();
      }
}

module.exports= client;