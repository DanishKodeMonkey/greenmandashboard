/* import Typescript Request Response types*/
import { Request, Response } from "express";
/* import custom typescript type interface */
import { DashboardResponse } from "../interfaces";

/* 
res: Response(object type shape)<DashboardResponse>(expected data shape) 
: void is the expected return type, it is normally inferred in this case (as express returns a res object) but set explicitly for example sake
*/
const getDashboard = (req: Request, res: Response<DashboardResponse>): void=>{
    res.render('index', {title: 'Dashboard'})
}

// export for router
export default {getDashboard}