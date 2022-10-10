//import { weatherData } from "/DATA/data.js";
import {
  CurrentCityInformation,
  getNextFiveHrsTemperature,
  cityInterval,
} from "/JAVASCRIPT/index.js";
/* Import cityname from json to the datalist,
   Create a array of citynames.
   This is a self invoking function.
 */
let cityData;
const atPresent = "NOW";
let cityNameList = [];
function appendCitynameToDropdown(weatherData) {
  const citiesList = document.getElementById("city_lists");
  for (let city in weatherData) {
    const options = document.createElement("OPTION");
    options.setAttribute("value", weatherData[city].cityName);
    citiesList.appendChild(options);
    cityNameList.push(weatherData[city].cityName.toLowerCase());
  }
}

/**
 *
 * Validating the entered cityname is valid or not
 * return true if it is valid or return false.
 * @param {string} cityname name of the  selected city
 * @return {boolean} cityname is valid or not
 */
let checkCitynameIsValid = (cityName) => {
  if (cityNameList.includes(cityName)) return true;
  return false;
};

/**
 *
 * A event listener function to update data for the city.
 * A closure function is used check the entered city name is valid or not.
 * If valid, the function will call all other functions to update live date, live time,
 * city icon, temperature, humitidy, precipitation, temperature for next five hours from current time and weather
 * icons according to the temperature value.
 * If it is invalid the invalid_Cityname function is called to display Nil value
 * @params {} nothing
 * @return {Function}function to update all data for the selected city and for invalid cityname.
 */
function updateDataOnCityname() {
  let selectedCity = document.getElementById("city_list").value.toLowerCase();
  const dateOfaCity = document.getElementsByClassName("date-style");
  return (async function () {
    if (checkCitynameIsValid(selectedCity)) {
      let cityName = document.getElementById("city_list").value;
      switch (cityName) {
        case "losangeles":
          cityName = "LosAngeles";
          break;
        case "newyork":
          cityName = "NewYork";
          break;
        case "brokenhill":
          cityName = "BrokenHill";
          break;
        case "bangkok":
          cityName = "BangKok";
          break;
        default:
          cityName = cityName.charAt(0).toUpperCase() + cityName.slice(1);
          break;
      }
      await appendNextFivehrs(cityName, weatherData);
      getNextFiveHrsTemperature();
      cityData = new CurrentCityInformation();
      cityData.setCityDetails(selectedCity);

      let temperatureCelsius = cityData.gettemperature();
      temperatureCelsius = temperatureCelsius.split("°");

      cityData.updateIconImageSource(selectedCity, "null");
      cityData.updateDateBasedOnCity(dateOfaCity, "null");
      cityData.updateTemperature(temperatureCelsius);

      cityData.updateUIElementAttributeWithTheGivenValue(
        "present_time",
        "innerHTML",
        atPresent
      );
      cityData.updateUIElementAttributeWithTheGivenValue(
        "present_temperature",
        "innerHTML",
        temperatureCelsius[0]
      );
      cityData.updateImageSource(
        temperatureCelsius[0],
        "icon_based_present_temp"
      );
      cityData.updateLiveTimeBasedOnTimezone();
      cityData.fetchAndUpdateTemperatureForNextfivehrs(selectedCity);
      document.getElementById("city_list").style.border = "0.5px solid black";
      document.getElementById("warning").style.display = "none";
    } else {
      clearInterval(cityInterval);
      cityData.updateUIWithNil(dateOfaCity);
    }
  })();
}

export { cityData, atPresent, cityNameList };
export { appendCitynameToDropdown, checkCitynameIsValid, updateDataOnCityname };
