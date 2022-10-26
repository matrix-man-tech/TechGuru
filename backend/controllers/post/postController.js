const expressAsyncHandler = require("express-async-handler");
const Post = require("../../models/post/Post");
const validateMongodbId = require("../../utils/validateMongodbID");
var Filter = require('bad-words');
const User = require("../../models/user/User");


const createPostCtrl = expressAsyncHandler(async(req,res)=>{
    const {_id} = req.user
    validateMongodbId(req.body.user)
    const filter = new Filter()
    const isProfane = filter.isProfane(req.body.title,req.body.description)
    if(isProfane){
        const user = await User.findByIdAndUpdate(_id,{
            isBlocked: true
        })
        throw new Error('profane words are used')
    }
    
    try {
        const post = await Post.create(req.body)
        res.json(post)
    } catch (error) {
        res.json(error)
    }
})

module.exports = createPostCtrl