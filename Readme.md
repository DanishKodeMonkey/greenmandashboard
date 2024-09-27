# GreenDashboard

WIP

## Proof of concept of a lightweight express typescript dashboard

### Setup

#### Packages

The project leverages the following packages in the node environment:

-   [express](http://expressjs.com/) - The javascript framework we build the project upon
-   [express-async-handler](https://www.npmjs.com/package/express-async-handler) - Simple async exceptions handler, wrapper for existing async functions.
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
-   [Prisma ORM](https://www.prisma.io/) - Powerful query manager, enables type safety for query operations, and generation of useful query engine tied directly to database schema.

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
├── build/                         # Compiled output of TypeScript files
│                                   # This folder is automatically generated after running `tsc`.
│
│── prisma/                        # Prisma-related files for database schema and migrations
│   │── schema.prisma              # Prisma schema file defining your data models and relations
│
├── node_modules/                  # Installed dependencies managed by npm
│                                   # Automatically generated after running `npm install`.
│
├── public/                        # Static files (images, CSS, JS)
│   │── styles.css                 # Custom styles to load on top of Bootstrap for styling the UI
│
├── src/                           # Source files for the application
│   ├── controller/                # Controllers for handling HTTP requests and business logic
│   │   └── indexController.ts     # Controller for handling requests to the index route
│   │
│   ├── db/                        # Database-related scripts and configurations
│   │   │                           # Alternatively would be called 'api' for all api interaction logic
│   │   ├── populateDB.ts          # Script for populating the database with initial data
│   │   ├── prismaclient.ts        # Prisma client setup and config for connecting to the database
│   │   ├── prismaQueries.ts       # Prisma functions to be used in controllers across app
│   │
│   ├── interfaces/                # TypeScript interfaces for typing objects and data structures
│   │   ├── index.ts               # Main file for exporting interfaces for the index controller
│   │
│   ├── router/                    # Routers for defining application routes
│   │   └── indexRouter.ts         # Router for handling the index route and sub-routes
│   │
│   ├── views/                     # EJS view templates for rendering HTML pages with javascript
│   │   └── index.ejs              # EJS template for the main dashboard page
│   │   └── partials/              # Reusable partial templates included in page views
│   │       ├── errors.ejs         # Partial for displaying error messages
│   │       ├── footer.ejs         # Footer partial for the application
│   │       ├── head.ejs           # Head partial for including meta tags, stylesheets, etc.
│   │       ├── postsPartial.ejs   # Partial for displaying a list of posts
│   │
│   └── app.ts                     # Main application entry point (Express app setup)
│
├── .env                           # Environment variables for configuration (e.g., DB credentials)
├── .gitignore                     # Specifies which files and directories to ignore in Git
├── docker-compose.yml             # Docker Compose configuration for multi-container setup
├── Dockerfile                     # Dockerfile for production build
├── Dockerfile.dev                 # Dockerfile for development environment with live-reload support
├── package-lock.json              # Automatically generated; locks the exact versions of installed dependencies
├── package.json                   # Project metadata, scripts, and dependencies configuration
├── README.md                      # Project documentation and instructions
└── tsconfig.json                  # TypeScript configuration file specifying compiler options
```

With this our traffic can now be directed and handled properly as such:

![diagram of request traversal](./public/requestresponsecycle.drawio.svg)

### Dockerize

Express like anything can be dockerized. So is this app

### Dockerfile and Dockerfile.dev

Pretty straight forward, build upon node:16, working from /app, copy the node package files and
install using npm, copy the remaining files to /app and expose on port 8000
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

### NPM scripts for docker.

To simplify engagements for the project, a population script was made to generate random entries in a docker database, in order to streamline the bootup process on a new device, some new scripts should be added to the `package.json`

1. devinitprisma - Initialize the prisma query engine by tying it to the database and generating the prismaclient package for import in the project, all done with prisma migrate.

```json
"devinitprisma": "docker-compose run app npx prisma migrate dev --name init"
```

2. devpopulatedb - populates the docker postgreSQL database with 50 generated entries through Prisma.

```json
"devpopulatedb": "docker-compose run app npx ts-node /app/src/db/populateDB.ts"
```

3. VerifyDB - logs in to the docker database and queries a simple select all command to see if the previous devpopulatedb command worked. Then terminates the query session gracefully.

```json
  "devcheckdb": "docker exec -it greendashboard-db-1 psql -U greenman -d powerrangers -c 'SELECT * FROM \"Post\";'"
```

4. initiateprissma
Initiates the prisma client by migrating the prisma schema to the database and generate a fresh prisma client for the dev environment.

```json
    "devinitiateprisma": "docker-compose run app npx prisma migrate dev --init"
```


## Connecting to database

While raw SQL querying is definately and easily possible within express, in order to promote type security to match against the database, a ORM may be a easier choice, enter Prisma:

### Prisma ORM

Prisma is an ORM that simplifies database interactions by providing a type-safe API to work with databases.

Prisma is, once installed and initialized, run from its prisma folder through its prisma schema
during development, the schema is used to generate a powerful query engine using the schema definitions which is imported to the rest of the project.

#### postgreSQL

For the purposes of this, we will use a dockerized postgreSQL database to connect to.

Back to yml!

We have added a database service, setting up a amazing postgresql database and linking
it to our app using a connection string (as required by prisma)

```yml
version: '2'

services:
    db:
        image: postgres:16
        restart: always
        environment:
            POSTGRES_USER: greenman
            POSTGRES_PASSWORD: iscomplicated
            POSTGRES_HOST: powerrangers
            POSTGRES_DB: trading
        ports:
            - '5432:5432'
        volumes:
            - db_data:/var/lib/postgresql/data #d ata persistance
    app:
        build:
            context: .
            dockerfile: Dockerfile.dev
        volumes:
            - ./src:/app/src

        ports:
            - '8000:8000'
        depends_on:
            - db
        environment:
            - PORT=8000
            - DATABASE_URL=postgresql://greenman:iscomplicated@powerrangers:5432/trading

volumes:
    db_data:
```


docstobefinished()