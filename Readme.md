# GreenDashboard

## Proof of concept of a lightweight express typescript dashboard

### Setup

#### Packages

The project leverages the following packages in the node environment:

-   [express](http://expressjs.com/) - The javascript framework we build the project upon
-   [typescript](https://www.typescriptlang.org/) - The javascript superset allowing type sets in the project
    -   [@types](https://www.typescriptlang.org/docs/handbook/2/type-declarations.html#what-do-type-declarations-look-like) - Additional tried and true community made types to infer typescript rules upon packages without native support
    -   [/express](https://www.npmjs.com/package/@types/express) - Typescript types for express (namely, Application)
    -   [/node](https://www.npmjs.com/package/@types/node) - Typescript types for node
    -   [/morgan](https://www.npmjs.com/package/@types/morgan) -Typescript types for morgan
    -   [/ejs](https://www.npmjs.com/package/@types/ejs) - Typescript types for ejs
-   [nodemon](https://www.npmjs.com/package/nodemon) - automatically restarts node application during development
-   [ts-node](https://www.npmjs.com/package/ts-node) - Compiler handler, compiling ts to javascript for us during dev
-   [morgan](https://www.npmjs.com/package/morgan) - A convenient request logger middleware, (will be used for its light request/response timer in this case)
-   [EJS](https://ejs.co/) - A lightweight and fast embedded javascript view engine

#### Configuration

##### tsconfig.json

tsconfig.json is created using typescripts `npm tsc --init` script through node(Omit npm if typescript is installed globally)

inside tsconfig.json the main setup made is:

```json
{
    "compilerOptions": {
        "target": "es6",
        "module": "commonjs",
        "outDir": "./build",
        "rootDir": "./src"
        "strict": true,
        "esModuleInterop": true
    }
}
```

These will ensure the typescript compiler is setup according to our node environment and intended setup, including the location we would like our compiled build `outDir` and our dev src directory `rootDir`

##### package.json

Some minor changes to package.json include

```json
{
    "main": "app.js" /* Set main entrypoint for the application */,
    "scripts": {
        "build": "tsc" /* command that runs typescript compiler */,
        "devstart": "nodemon" /* command that runs nodemon for development */
    },
    /* nodemon configuration sets nodemon to watch all the .ts files inside the src folder and execute ts-node src/index.ts on any code change. */
    "nodemonConfig": {
        "watch": ["src"],
        "ext": "ts",
        "exec": "ts-node src/app.ts"
    }
}
```

We now have two main npm commands to run as needed `npm run build` for when we need a ts build (more or this later) and `npm run devstart` for a convenient dev autocompiler

### Folder structure

The projects structure is as follows;

```
greendashboard/
│
├── build/                     # Compiled output of TypeScript files
│
├── node_modules/             # Installed dependencies
│
├── public/                    # Static files (images, CSS, JS)
│
├── src/                       # Source files
│   ├── controller/            # Controllers for handling requests
│   │   └── indexController.ts # Controller for the index route
│   │
│   ├── router/                # Routers for defining application routes
│   │   └── indexRouter.ts      # Router for the index route
│   │
│   ├── views/                 # EJS view templates
│   │   └── index.ejs          # EJS template for the dashboard
│   │
│   └── app.ts                 # Main application entry point
│
├── .env                       # Environment variables
├── .gitignore                 # Files and folders to ignore in Git
├── package-lock.json          # Exact version of installed dependencies
├── package.json               # Project metadata and dependencies
├── README.md                  # Project documentation
└── tsconfig.json              # TypeScript configuration file
```

With this our traffic can now be directed and handled properly as such:

REQUEST
|
V
+--------------------------------+
| app.ts |
|--------------------------------|
| - Middleware |
| - Parses req.body to JSON |
| - Logs traffic using Morgan |
| - Serves static content |
+--------------------------------+
|
V
+--------------------+
| Router Matching |
| (e.g. app.use('/', |
| indexRouter)) |
+--------------------+
|
V
+------------------------+
| router/indexRouter.ts |
|------------------------|
| - Matches sub-routes |
| (e.g. '/' root route)|
+------------------------+
|
V
+-------------------------------------+
| Middleware Functions are called |
| (e.g. indexController.getDashboard) |
| Could include any number of |
| middleware in sequence |
+-------------------------------------+
|
V
+---------------------------------+
| controller/indexController.ts |
|---------------------------------|
| - Executes logic against req |
| - TypeScript checks shapes |
| - Generates response (EJS view) |
| Could be anything, including |
| fetching data from API, |
| generating graphs, tables etc. |
+---------------------------------+
|
V
+----------------------+
| Response to Client |
| (Returned to browser)|
+----------------------+

### Dockerize

Express like anything can be dockerized. So is this app

### Dockerfile and Dockerfile.dev

Pretty straight forward, build upon node:16, working from /app, copy the node package files and
install using npm, copy the remaining files to /app and expose on port 800
finally run the nodemon devstart command.

#### Development

```dockerfile
FROM node:16

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 8000

CMD ["npm", "run", "devstart"]

```

#### Production

In production we create a multi stage build using the alpine build of node, because it creates a smaller final image by excluding unnecessary development files and only copying the essential built assets from the first stage.

##### Stage 1 - Builder:
Like before, copy the relevant files to the work directory and install the dependencies.
and copy over our application code.
we then run the build script, allowing typescript to compile and bundle for production

##### Stage 2 - Server :
Like before, we prepare our work directory, installing the base image but this time only installing the production dependencies, we then copy the built assets (/public)
and compiled code from our builder stage to our server stage.
Finally we run the default node start command, to run the application as defined in package.json

```dockerfile
FROM node:16-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM node:16-alpine AS server
WORKDIR /app
COPY package*.json ./
RUN npm install --production
COPY --from=builder ./app/public ./public
COPY --from=builder ./app/build ./build
EXPOSE 8000
CMD ["npm", "start"]
```

### docker-compose.yml

Main point of note here is the mounting of the project src folder to the docker container folder.
This will allow the server to be run with auto-restart on code change.

```yml
version: '1'

services:
    app:
        build:
            context: .
            dockerfile: Dockerfile
        volumes: -./src:/app/src
        ports:
            - '8000:8000'
```
