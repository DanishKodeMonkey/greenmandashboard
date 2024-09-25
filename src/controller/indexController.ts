/* import Typescript Request Response types*/
import { Request, Response } from "express";
import asyncHandler from 'express-async-handler'
/* import custom typescript type interface */
import { DashboardResponse } from "../interfaces";

import postQueries from "../db/prismaQueries";
import { prepareChartData } from "../utils/charts";

/* 
res: Response(object type shape)<DashboardResponse>(expected data shape) 
: void is the expected return type, it is normally inferred in this case (as express returns a res object) but set explicitly for example sake
*/
const getDashboard = asyncHandler(async(req: Request, res: Response<DashboardResponse>)=>{
    try{
    const posts = await postQueries.getAllPosts()
    res.render('index', {title: 'Dashboard', posts: posts, errors: []})
}catch(err){
    res.render('index', {title: 'Dashboard', posts: [], errors: err})
}
})

const getChart = asyncHandler(async(req: Request, res: Response)=>{
    try{
        const posts = await postQueries.getAllPosts()
        const chartData = prepareChartData(posts)
        const chartLayout = {
            title: 'Price trends',
            xaxis: {title: 'Date'},
            yaxis: {title: 'Price'}
        }
        console.log(chartData)
        res.render('chart', {title: 'Post chart', data: chartData, layout: chartLayout, errors: []})
    }catch(err){
        console.error(err)
        res.status(500).send('Internal server error')
    }
})

// export for router
export default { getDashboard, getChart}