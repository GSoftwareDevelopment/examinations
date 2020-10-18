This document has been translated by Google Translate

[Polish version](README-PL.md)

# Introduction

The original purpose of the application was to store the results of medical tests, such as weight, temperature and sugar measurements.
However, with development, I have come to the conclusion that the app can store different results.

The application is a "test" of skills related to technologies:

- Docker
- Node.JS
- WebPack
- MongoDB
- Passport for Google and Facebook Login
- Express.js
- Handlebars
  
# Basic goals of the application

- Defining the research structure divided into groups
- Defining test components, ie measurement values ​​and standards
- Collecting measurements
- Presentation of measurements

# Launching the application

So far, launching the application consists of several steps:

1. Docker-compose
2. Configuration
3. Webpack
4. Server
   
## Docker-compose

Generally used to run the MongoDB database server, but if you have MongoDB you don't need to run it.

`docker-compose up`

## Configuration

The basic configuration of the application can be found in the `/config/config.env` file, and its individual elements define:

`PORT` - the port where the server is started, by default 3000

`MONGO_URI` - address of the MongoDB database server

`Google` section - defines the access parameters to the Google API interface of the login service.

The `Facebook` section - defines the access parameters to the Facebook API login service

## Webpack
Creates a static UI page, but requires a server running to function fully.

Run the command:

`npm run build`

## Server
So far, only the developer version of the application is available.

`npm run dev`

## Browser

In your favorite browser, enter the address `http://localhost:3000` (or instead of 3000, enter the port number that is set in the configuration)