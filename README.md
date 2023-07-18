# LODIIS CUSTOM REPORT

## Contents

1.  #### [About](#about)
2.  #### [Pre-requisites](#preRequisites)
3.  #### [Project setup](#setup)
4.  #### [Running the app](#run)
5.  #### [Building the app](#build)

## <a name='about'></a>1. About

This is a web application for generating custom reports for the LODIIS system. It allows the generation fo these reports based on the set report configurations and current user access. Additionally, it also allows downloading of the generated reports for further analysis.

## <a name='preRequisites'></a>2. Pre-requisites

To get started with the app, you will need:

```
node 12.14.1

npm 6.13.4

angular +12.2.0
```

## <a name='setup'></a>3. Project setup

Setting up the project is done by going through two steps:

- Packages installations
- Proxy setup

### Packages installations

Project dependency packages can be downloaded through `npm` by using the below command:

```
npm install
```

### Proxy setup

The proxy server can be set by creating on the root project directory, the `proxy-config.json` with contents similar to `proxy-config.example.json` or as shown below:

```
{
  "/api": {
    "target": "<url_to_dhis_instance>",
    "secure": "false",
    "auth": "<username>:<password>",
    "changeOrigin": "true"
  },
  "/": {
    "target": "<url_to_dhis_instance>",
    "secure": "false",
    "auth": "<username>:<password>",
    "changeOrigin": "true"
  }
}
```

## <a name='run'></a>4. Running the app

With the project properly set up, the LODIIS custom report app can be run by the scripts specified on the `package.json` file using the below `npm` command.

```
npm start
```

This will expose the `http://localhost:4200` or another port (that will be specified on the command line interface) ready to be opened on the browser to view the app.

## <a name='build'></a>5. Building the app

The app can be built using the `package.json` specified script for building by running the below command

```
npm run build
```

This command will created a build folder with a zipped build file at the `dist` folder found at the root directory.
