"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const morgan_1 = __importDefault(require("morgan"));
const path_1 = __importDefault(require("path"));
/* import routers */
const indexRouter_1 = __importDefault(require("./router/indexRouter"));
/* Initialize express application.
Why "Application"?
If using typescript, Application will infer typescript types upon the object
for code assistance and error checking. Imported via @types/express*/
const app = (0, express_1.default)();
/* Configure application object */
app.set('view engine', 'ejs');
app.set('views', path_1.default.join(__dirname, 'views'));
/* Set up the chain of middleware to pass the request through before matching to a path */
app.use(express_1.default.json()); /* body parser, parsing request body to json */
app.use((0, morgan_1.default)("tiny")); /* HTTP logger with minimal logging details(tiny), including timer for request/response cycle */
app.use(express_1.default.static("public")); /* Serve static files to be available like pictures etc. */
app.use('/', indexRouter_1.default);
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log("Server is running on port", PORT);
});
