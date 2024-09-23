/* import Typescript Request Response types*/
import { Request, Response } from "express";
import asyncHandler from 'express-async-handler'
/* import custom typescript type interface */
import { DashboardResponse } from "../interfaces";

import postQueries from "../db/prismaQueries";

/* 
res: Response(object type shape)<DashboardResponse>(expected data shape) 
: void is the expected return type, it is normally inferred in this case (as express returns a res object) but set explicitly for example sake
*/
const getDashboard = asyncHandler(async(req: Request, res: Response<DashboardResponse>)=>{
    const posts = await postQueries.getAllPosts()
    res.render('index', {title: 'Dashboard', posts})
})

// export for router
export default { getDashboard }