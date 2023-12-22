import express from "express"
import dotenv from "dotenv"
import connectDB from "./config/db.js"
import morgan from "morgan"
import authRouter from "./routes/authRoute.js"
import categoryRouter from "./routes/categoryRoute.js"
import productRouter from "./routes/productRoute.js"
import cors from "cors"
import path from "path"
import {fileURLToPath} from "URL"

//configure env
dotenv.config()

//
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename)

//connect to database
connectDB()

//rest object 
const app = express()

//middleware
app.use(cors())
app.use(express.json())
app.use(morgan("dev"))
app.use(express.static(path.join(__dirname, "../client/build")))

//routes
app.use("/api/v1/auth", authRouter)
app.use("/api/v1/category", categoryRouter)
app.use("/api/v1/product", productRouter)

// rest api
app.get("*", function (req, res) {
    res.sendFile(path.join("../client/build/index.html"))
})

app.listen(parseInt(process.env.PORT), () => {
    console.log(`App is listening at ${process.env.DEV_MODE} mode on port ${process.env.PORT}...`)
})
