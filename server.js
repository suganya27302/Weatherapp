/**
 * Importing the neccessary packages.
 */
const express = require("express");
const path = require("path");
const fs = require("fs");
const app = express();
const bodyParser = require("body-parser");
const { fork } = require("child_process");
const logger = require("morgan");
let startTime = new Date();
let weatherData = [];
let dayCheck = 14400000;

/**
 * body-parser, which is used to fetch input data from body.
 * extended is set to false, it returns objects.
 * Note: If extended is set to true it returns object of objects
 * and qslibrary is used to parse object
 */
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

/**
 * Render the Webpage using the middleware.
 */
app.use("/", express.static("./"));

// create a write stream (in append mode)
var accessLogStream = fs.createWriteStream(path.join(__dirname, "access.log"));

// setup the logger
app.use(logger("tiny", { stream: accessLogStream }));

/**
 * Respond to the request to fetch all cities data.
 * create child process and send message to timezone.js and
 * the data captured by the listener.
 * Every four hours once, the request is raised from index.js
 * it will update the all cities data and
 * respond to the client.
 */
app.get("/all-timezone-cities", function (request, response) {
  // create a Child process using fork
  let allTimezon = fork(__dirname + "/JAVASCRIPT/child.js");

  allTimezon.on("message", (weatherinfo) => {
    weatherData = weatherinfo;
    response.json(weatherinfo);
  });

  let currentTime = new Date();
  if (currentTime - startTime > dayCheck) {
    startTime = new Date();
    allTimezon.send({ messagename: "GetData", messagebody: {} });
  } else {
    if (weatherData.length === 0) {
      allTimezon.send({ messagename: "GetData", messagebody: {} });
    } else {
      response.json(weatherData);
    }
  }
});

/**
 * Respond to the request to fetch the city information
 * To avoid conflict, the route path is taken as '/city'.
 * create child process and send message to timezone.js and
 * the data captured by the listener.
 * When the url is with a city query, it fetch the selected city information
 * and respond back to the client.
 * If it unable to call the function it displays error message to page.
 * */
app.get("/city", function (request, response) {
  try {
    let city = request.query.city;
    // create a Child process using fork
    let cityInfo = fork(__dirname + "/JAVASCRIPT/child.js");

    cityInfo.on("message", (cityData) => {
      response.json(cityData);
    });

    if (!city) throw new Error("cityname value is null");
    else {
      let message = {
        messagename: "GetcityInfo",
        messagebody: { cityname: city },
      };
      cityInfo.send(message);
    }
  } catch (error) {
    let date = new Date();
    let errorMessage =
      "\n" +
      date.toDateString() +
      " " +
      date.toLocaleTimeString() +
      " " +
      error.message +
      " in http://127.0.0.1" +
      request.url;

    // create a logger file and append the error message
    fs.appendFile("logger.txt", errorMessage, function (err) {
      console.log(errorMessage);
    });

    response
      .status(404)
      .json({ Error: "Not a valid Endpoint,Please check with it." + "\n" + error.message});
  }
});

/**
 * When the url with hourly-forecast and post request
 * create child process and send message to timezone.js and
 * the data captured by the listener.
 * captured data from body is used as a parameter to fetch the next five hours temperature
 * and respond back to the client.
 * If it unable to call the function it displays error message to page.
 * */
app.post("/hourly-forecast", function (request, response) {
  try {
    // create a Child process using fork
    let temperature = fork(__dirname + "/JAVASCRIPT/child.js");

    temperature.on("message", (nextFiveHrs) => {
      response.json(nextFiveHrs);
    });

    if (!request.body) throw new Error("Request body is null ");
    else {
      if (
        !(request.body.city_Date_Time_Name && request.body.hours && weatherData)
      )
        throw new Error("Request body argument values are null");
      else {
        let message = {
          messagename: "GetTemperature",
          messagebody: {
            cityDTN: request.body.city_Date_Time_Name,
            hours: request.body.hours,
            weatherData: weatherData,
          },
        };
        temperature.send(message);
      }
    }
  } catch (error) {
    let date = new Date();
    let errorMessage =
      "\n" +
      date.toDateString() +
      " " +
      date.toLocaleTimeString() +
      " " +
      error.message +
      " in http://127.0.0.1" +
      request.url;
    // create a logger file and append the error message
    fs.appendFile("logger.txt", errorMessage, function (err) {
      console.log(errorMessage);
    });

    response
      .status(404)
      .json({ Error: "Not a valid Endpoint,Please check with it."+ "\n" + error.message });
  }
});

// if the request is invalid it display a error message
app.get("*", (request, response) => {
  response.send("404! This is an invalid URL.");
});

/**
 *  Local server to handle request and response back to the client.
 *  if the request is invalid it display a error message
 *  orelse it fetch the data and return response.
 */
app.listen(8125);
console.log("Server listening at http://127.0.0.1:8125/");
