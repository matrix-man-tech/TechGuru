const express = require("express")
const {
    createPostCtrl, 
    fetchPostsCtrl, 
    fetchPostCtrl,
    updatePostCtrl,
    deletePostCtrl} = require("../../controllers/post/postController")
const authMiddleware = require("../../middleware/auth/authMiddleware")
const { photoUpload,postImgResize } = require("../../middleware/upload/photoUpload")


postRoutes = express.Router()

postRoutes.post(
    '/',
    authMiddleware,
    photoUpload.single('image') ,
    postImgResize,
    createPostCtrl
)

postRoutes.get('/',fetchPostsCtrl)
postRoutes.get('/:id',fetchPostCtrl)
postRoutes.put('/:id',authMiddleware, updatePostCtrl)
postRoutes.delete('/:id',authMiddleware, deletePostCtrl)


module.exports = postRoutes