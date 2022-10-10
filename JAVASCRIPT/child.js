// Import the neccessary module
const timezone = require("@suganya27/weather_data");

/* The listener will receive a message from server.js(parent) and based on that
 *  message a particular function is called and the resulted data is returned to server.js.
 */
process.on("message", (message) => {
  let Data;
  if (message.messagename == "GetTemperature") {
    Data = timezone.nextNhoursWeather(
      message.messagebody.cityDTN,
      message.messagebody.hours,
      message.messagebody.weatherData
    );
  } else if (message.messagename == "GetcityInfo") {
    Data = timezone.timeForOneCity(message.messagebody.cityname);
  } else if (message.messagename == "GetData") {
    Data = timezone.allTimeZones();
  }
  process.send(Data);
  process.exit();
});
