import express from "express"
import dotenv from "dotenv"
import cors from "cors"
import morgan from "morgan"
import path from "path"
import fileUpload from 'express-fileupload';
import {errorHandler} from "./middlewares/error-handler.js"

import connectDB from "./config/db.js"
import admin_router from "./routes/AdminRoutes.js"
import user_router from "./routes/UserRoutes.js"

dotenv.config({path: "./config/.env"});
connectDB().then()

const app = express()

app.use(morgan("dev"))
app.use(cors())
app.use(express.json({limit: "50mb"}))
app.use(express.urlencoded({extended: "true", limit: "50mb"}))
app.use(fileUpload());
app.use("/api/admin", admin_router)
app.use("/api/user", user_router)

app.use(errorHandler)

const PORT = process.env.PORT || 5000;
app.listen(
    PORT,
    console.log(`server runnin in ${process.env.NODE_ENV} mode on port ${PORT}`)
)