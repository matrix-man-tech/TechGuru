const express = require("express")
const dotenv = require("dotenv")
const dbConnect = require('./config/db/dbConnect')
const userRoutes = require("./routes/users/userRoutes")
const { notFound, errorHandler } = require("./middleware/error/errorHandler")
const authMiddleware = require("./middleware/auth/authMiddleware")

const app = express()
dotenv.config()
//db
dbConnect()

app.use(express.json())
app.use('/api/users',userRoutes)

app.use(notFound)
app.use(errorHandler)
app.use(authMiddleware)

const PORT = process.env.PORT 
app.listen(PORT, console.log(`server is running at ${PORT}`))

