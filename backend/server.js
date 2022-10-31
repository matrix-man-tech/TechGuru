const express = require("express")
const dotenv = require("dotenv")
const dbConnect = require('./config/db/dbConnect')
const userRoutes = require("./routes/users/userRoutes")
const { notFound, errorHandler } = require("./middleware/error/errorHandler")
const authMiddleware = require("./middleware/auth/authMiddleware")
const postRoutes = require('./routes/posts/postRoutes')
const commentRoutes = require('./routes/comments/commentRoutes')
const categoryRoute = require("./routes/category/categoryRoutes")

const app = express()
dotenv.config()
//db
dbConnect()

app.use(express.json())


app.use('/api/users',userRoutes)
app.use('/api/posts',postRoutes)
app.use('/api/comments',commentRoutes)
app.use('/api/category', categoryRoute)

app.use(notFound)
app.use(errorHandler)
app.use(authMiddleware)

const PORT = process.env.PORT 
app.listen(PORT, console.log(`server is running at ${PORT}`))

