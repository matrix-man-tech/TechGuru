const express = require("express")
const createPostCtrl = require("../../controllers/post/postController")
const authMiddleware = require("../../middleware/auth/authMiddleware")

postRoutes = express.Router()

postRoutes.post('/',authMiddleware, createPostCtrl)




module.exports = postRoutes