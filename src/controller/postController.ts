import {Request, Response} from 'express'
import asyncHandler from 'express-async-handler'
import postQueries from '../db/prismaQueries'

const getPost = asyncHandler(async(req: Request, res: Response)=>{
    const postId = parseInt(req.params.postId)
try{

    const post = await postQueries.getPost(postId: Number)
}catch(err){
    console.log()
}
})