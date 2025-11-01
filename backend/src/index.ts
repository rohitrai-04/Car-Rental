import dotenv from 'dotenv'
dotenv.config()

import express, { urlencoded } from 'express'
import cors from 'cors'
import { config } from './config/app.config'

const app = express()

const PORT = config.PORT || 3000
const BASE_PATH = config.BASE_PATH

app.use(cors({
    origin: config.FRONTEND_ORIGIN,
    credentials: true
}))

app.use(express.json())
app.use(urlencoded({extended: true}))




app.listen(3000, () => console.log('Server is running on port 3000'))