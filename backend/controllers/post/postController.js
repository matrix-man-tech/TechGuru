const expressAsyncHandler = require("express-async-handler");
const fs = require('fs')
const Post = require("../../models/post/Post");
const validateMongodbId = require("../../utils/validateMongodbID");
var Filter = require('bad-words');
const User = require("../../models/user/User");
const cloudinaryUploading = require("../../utils/cloudinary");
const { postImgResize } = require("../../middleware/upload/photoUpload");


const createPostCtrl = expressAsyncHandler(async(req,res)=>{
    console.log(req.file);
    const {_id} = req.user
    validateMongodbId(req.body.user)
    const filter = new Filter()
    const isProfane = filter.isProfane(req.body.title,req.body.description)
    if(isProfane){
        const user = await User.findByIdAndUpdate(_id,{
            isBlocked: true
        })
        throw new Error('profane words are used,you are blocked')
    }
    const localPath = `public/images/posts/${req.file.filename}`
    const imageUpload =  await cloudinaryUploading(localPath)
    // res.json(imageUpload)
    try {
        const post = await Post.create({
            ...req.body,
            image: imageUpload?.url,
            user: _id,
            title: req.body.title
        })
        res.json(imageUpload)
        fs.unlinkSync(localPath)
    } catch (error) {
        res.json(error)
    }
    
})

const fetchPostsCtrl = expressAsyncHandler(async(req,res)=>{
    try {
        const posts = await Post.find({}).populate("user")
        res.json(posts)
    } catch (error) {
        res.json(error)
    }
    
})

const fetchPostCtrl = expressAsyncHandler(async(req,res)=>{
    const {id} = req.params
    validateMongodbId(id)
    try {
        const post  = await Post.findById(id).populate("user")
        
        await Post.findByIdAndUpdate(id,{
            $inc: {numViews: 1}
        },
        {
            new: true
        }) 
        res.json(post)
    } catch (error) {
        res.json(error)
    }
})

const updatePostCtrl = expressAsyncHandler(async(req,res)=>{
    const {id} = req.params
    validateMongodbId(id)
    try {
        const post = await Post.findByIdAndUpdate(id, {
            ...req.body,
            user: req.user?._id
        },{
            new:true
        })
        res.json(post)
    } catch (error) {
        res.json(error)
    }
})

const deletePostCtrl = expressAsyncHandler(async(req,res)=>{
    const {id} = req.params
    validateMongodbId(id)
    try {
        const post = await Post.findByIdAndDelete(id)
        res.json(post)
    } catch (error) {
        res.json(error)
    }
})

module.exports = { 
    createPostCtrl,
    fetchPostsCtrl,
    fetchPostCtrl,
    updatePostCtrl,
    deletePostCtrl
    }