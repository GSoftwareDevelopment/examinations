This document has been translated by Google Translate

[Polish version](README-PL.md)

# Introduction

The original purpose of the application was to store the results of medical tests, such as weight, temperature and sugar measurements.
However, with development, I have come to the conclusion that the app can store different results.

The application is a "test" of skills related to technologies:

## Stack:

- Javascript
- Node.JS

## Backend:

- Express.js
- MongoDB
- Passport for login

## Frontend:

- React
  
# Basic goals of the application

- Defining the structure of the research divided into groups
- Defining test components, ie measurement values ​​and standards
- Collecting measurements
- Presentation of measurements

# Launch

## Configuration

The basic configuration of the application can be found in the `/backend/config/config.env` file, and its individual elements define:

`PORT` - the port where the server is started, by default 3000

`MONGO_URI` - address of the MongoDB database server

## Backend

After configuring `.env`, run this command:

`npm run dev`

## Frontend

A backend must be run.

Follow the command

`npm start`