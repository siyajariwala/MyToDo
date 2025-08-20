import express from "express"
import dotenv from "dotenv"
import cors from "cors"
import taskRoutes from "./routes/task.routes.js"
import { connectDb } from "./lib/db.js"
dotenv.config()
const app=express()
app.use(cors({
  origin: [
    "http://localhost:5173", // Local development
   "https://my-to-do-peach.vercel.app"// Production frontend URL (will be set in Render)
  ],
  credentials: true
}))
app.use(express.json())
app.use("/api/tasks",taskRoutes);
const PORT=process.env.PORT || 5001
connectDb()
app.get("/",(req,res)=>{
    res.send("Hello")
})

app.listen(PORT ,()=>{
    console.log(`Server is running on port ${PORT}`)
})