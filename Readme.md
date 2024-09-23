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
