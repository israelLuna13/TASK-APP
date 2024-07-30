import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import {corsConfig} from './config/cors'
import { connectDB } from './config/db'
import ProjectRoutes from './routes/projectRoutes'

dotenv.config()
connectDB()
const app = express()
//we enable cors
app.use(cors(corsConfig))
//permision read from body
app.use(express.json())

//routes
app.use('/api/projects',ProjectRoutes)
export default app