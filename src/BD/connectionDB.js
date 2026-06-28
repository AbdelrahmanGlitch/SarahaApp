import mongoose from "mongoose";

const connectionDB = async () =>{
    console.log("URI_ONLINE =", process.env.URI_ONLINE);
    await mongoose.connect(process.env.URI_ONLINE, {
        family: 4
    })
    .then(()=>{
        console.log("Connected to MongoDB ...")
    })
    .catch((err)=>{
        console.log("Error connectionDB to MongoDB", err)
    })
}
export default connectionDB;