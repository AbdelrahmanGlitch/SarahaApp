import mongoose from "mongoose";

const connectionDB = async () =>{
    await mongoose.connect(process.env.URI_ONLINE)
    .then(()=>{
        console.log("Connected to MongoDB ...")
    })
    .catch((err)=>{
        console.log("Error connectionDB to MongoDB", err)
    })
}
export default connectionDB;