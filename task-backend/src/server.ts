import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import morgan from 'morgan'
import {corsConfig} from './config/cors'
import { connectDB } from './config/db'
import ProjectRoutes from './routes/projectRoutes'
import authRoutes from './routes/authRoutes'

dotenv.config()
connectDB()
const app = express()
//we enable cors
app.use(cors(corsConfig))

//permision read from body
app.use(express.json())

app.use(morgan('dev'))

//routes
app.use('/api/auth',authRoutes)
app.use('/api/projects',ProjectRoutes)
export default app