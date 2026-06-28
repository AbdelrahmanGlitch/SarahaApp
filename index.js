import dotenv from "dotenv";
dotenv.config()
import express from "express";
import booystrap from './src/app.controller.js';
const app = express()
const port = process.env.PORT


booystrap(app, express);

app.listen(port, ()=> console.log(`server is running on port ${port}!`))