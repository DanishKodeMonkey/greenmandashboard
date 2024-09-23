import express, { Application } from 'express';
import morgan from 'morgan';
import path from 'path'


/* import routers */
import indexRouter from './router/indexRouter'

/* Initialize express application.
Why "Application"? 
If using typescript, Application will infer typescript types upon the object
for code assistance and error checking. Imported via @types/express*/
const app: Application = express();

/* Configure application object */
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))

/* Set up the chain of middleware to pass the request through before matching to a path */

app.use(express.json()) /* body parser, parsing request body to json */
app.use(morgan("tiny")) /* HTTP logger with minimal logging details(tiny), including timer for request/response cycle */
app.use(express.static("public")) /* Serve static files to be available like pictures etc. */

/* Define routers in order of root route, will be matched against from top to bottom. */
app.use('/', indexRouter)


const PORT = process.env.PORT || 3000;
app.listen(PORT, ()=>{
    console.log("Server is running on port", PORT)
})