let selectedCity;
/**
 * fetch the live weather data by sending a
 * get request to the server.
 * @params {} nothing
 * @return {object} All cities weather data {cityname :{all details of city}}
 */
function sendHttpRequestTofetchweatherData() {
  let response = new Promise(async (resolve, reject) => {
    let weatherData = await fetch(`http://127.0.0.1:8125/all-timezone-cities`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (weatherData.ok) resolve(weatherData.json());
    else {
      reject("Something went wrong..");
    }
  });
  return response;
}

/**
 * fetch the current city information by sending a
 * get request and taking the current city as input.
 * Add '/city' endpoint to the url, to fetch the city data from server.
 * @params {selectedCity} Current city
 * @return {object} city information {cityname :{time,date of the city}}
 */
function sendHttpRequestTofetchCityInformation(selectedCity, default_city) {
  let cityName;
  let response = new Promise(async (resolve, reject) => {
    if (default_city) {
      cityName = await fetch(`http://127.0.0.1:8125/city?city=London`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
    } else {
      cityName = await fetch(
        `http://127.0.0.1:8125/city?city=${selectedCity}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    }
    if (cityName.ok) resolve(cityName.json());
    else {
      alert("Not a Valid API, So sending default city as london.");
      cityName = await fetch(`http://127.0.0.1:8125/city?city=London`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      document.getElementById("city_list").value = "London";
      if (cityName.ok) {
        resolve(cityName.json());
      } else reject("Something went wrong..");
    }
  });
  return response;
}

/**
 * fetch the live temperature value for next five hours
 * by sending a current city information through the post request.
 * @params {string} nameOfCity
 * @return {object} weather data with next five hours temperature value {cityname :{[+1,+2,+3,+4,+5],temperature:[1,2,3,5,6]}}
 */
function sendHttpRequestTofetchNextFivehrsTemperature(nameOfCity) {
  let response = new Promise(async (resolve, reject) => {
    let nextFiveHrs = await fetch(`http://127.0.0.1:8125/hourly-forecast`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(nameOfCity),
    });
    if (nextFiveHrs.ok) {
      resolve(nextFiveHrs.json());
    } else {
      alert("Not a Valid API, So sending default city as london.");
      reject("Something went wrong..");
    }
  });
  return response;
}
var weatherData;

/**
 *
 * Replace the key value with the cityname.
 * @param {array} array
 * @param {string} key
 * @return {array} object weatherData {cityname:{city info}}
 */
function updateKeyValue(array, key) {
  return array.reduce((object, item) => {
    object[item[key].toLowerCase()] = item;
    return object;
  }, {});
}

let flag = 1;
/**
 *
 * fetch the city information taking cityname as parameter and the return object is
 * given as parameter to fetch Temperature value for next five hours.
 * update the weather data with the temperature array.
 * @param {string} nameOfCity current city
 * @param {object} weatherData Weather details {cityname:{city details}}
 * @returns {void} nothing
 */
async function fetchNextFivehrsForTheCity(nameOfCity, weatherData) {
  let nextFiveHrs;
  let cityInfo;
  if (flag) {
    cityInfo = await sendHttpRequestTofetchCityInformation(nameOfCity, "True");
    flag = 0;
  } else cityInfo = await sendHttpRequestTofetchCityInformation(nameOfCity, "");
  nameOfCity = document.getElementById("city_list").value;
  cityInfo.hours = 6;
  nextFiveHrs = await sendHttpRequestTofetchNextFivehrsTemperature(cityInfo);
  weatherData[nameOfCity.toLowerCase()].nextFiveHrs = nextFiveHrs.temperature;
}

/**
 *
 *  fetch next five hours temperature value and append to the object.
 * @param {string} nameOfCity Selected city name
 * @param {object} weatherData Object {cityname:{city details}}
 */
function appendNextFivehrs(nameOfCity, weatherData) {
  weatherData = fetchNextFivehrsForTheCity(nameOfCity, weatherData);
  return weatherData;
}

/**
 * Fetch the weather data and replace the key value.
 * @params {} nothing
 * @return {object} weatherData all cities weather data
 */
async function fetchweatherDataAndUpdateKeyValue() {
  let liveDataOfCities;
  try {
    liveDataOfCities = await sendHttpRequestTofetchweatherData();
    weatherData = updateKeyValue(liveDataOfCities, "cityName");
  } catch (error) {
    console.log(error);
  }
  return weatherData;
}

/**
 * the function, which is used to call the functions, which are responsible for
 * fetch the live weather data.
 * @params {} nothing
 * @return {object} weatherData all cities weather data {cityname :{ city details}}
 */
function getWeatherData() {
  let weatherData = fetchweatherDataAndUpdateKeyValue();
  return weatherData;
}
