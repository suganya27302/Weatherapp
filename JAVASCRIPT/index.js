//Top section Javscript functions
//import files
//import { weatherData } from "/DATA/data.js";
import * as utility from "/JAVASCRIPT/utility.js";

/** @type {string,reference} */
const emptyValue = "NIL";
let timeout;

/**
 * A Class which contains constructor and methods to populate the current city details
 * to the UI.
 * @return {void} nothing
 */
class CurrentCityInformation {
  /**
   * A constructor function , which will set current city details.
   * @return {void} nothing
   */
  constructor() {
    this.setCityDetails = function (selectedCity) {
      this.cityName = weatherData[selectedCity].cityName;
      this.dateAndTime = weatherData[selectedCity].dateAndTime;
      this.timeZone = weatherData[selectedCity].timeZone;
      this.temperature = weatherData[selectedCity].temperature;
      this.humidity = weatherData[selectedCity].humidity;
      this.precipitation = weatherData[selectedCity].precipitation;
    };
    this.getCityname = function () {
      return this.cityName;
    };
    this.getdateAndTime = function () {
      return this.dateAndTime;
    };
    this.gettimeZone = function () {
      return this.timeZone;
    };
    this.gettemperature = function () {
      return this.temperature;
    };
    this.gethumidity = function () {
      return this.humidity;
    };
    this.getprecipitation = function () {
      return this.precipitation;
    };
  }
  /**
   *
   * Manipulates the image source based on the cityname
   * @param {string} cityname name of the  selected city
   * @return {void} nothing
   */
  updateIconImageSource(selectedCity, weathericonIdname) {
    const imagePath = "./ASSETS/" + selectedCity + ".svg";
    if (weathericonIdname == "null") {
      this.updateUIElementAttributeWithTheGivenValue("icon", "src", imagePath);
    } else {
      return imagePath;
    }
  }
  /**
   *
   * To update the Live date of the selected city in the top section
   * Live date is updated and citydate function is used to
   * append prefix as zero to the date as it satisfies the condition.
   * @param {string} selectedCity name of the  selected city
   * @param {reference} dateOfaCity Object reference
   * @return {string} cityDate  live date of the city
   */
  updateDateBasedOnCity(dateOfaCity, weathericonIdname) {
    var dateTime = new Date().toLocaleString("en-US", {
      timeZone: this.gettimeZone(),
    });
    let date = new Date(dateTime).getDate();
    let month = new Date(dateTime).toLocaleString("en-US", {
      month: "short",
    });
    let year = new Date(dateTime).getFullYear();

    let cityDate = (function () {
      return date >= 1 && date <= 9
        ? `0${date}- ${month}- ${year}`
        : `${date}-${month}-${year}`;
    })();

    if (weathericonIdname == "null") {
      dateOfaCity[0].innerHTML = cityDate;
    } else {
      return cityDate;
    }
  }
  /**
   *
   * To update the Live time of the selected city in the top section
   * By using date object and its methods live date is fetched and  using hour value am or pm is decided.
   * if the second , minute , hour is less than 10 append zero to the beginning.
   * setinterval used to repeatedly call the displayLiveTime function
   * @param {string} selectedCity name of the  selected city
   * @return {void} nothing
   */
  updateLiveTimeBasedOnTimezone() {
    function displayLiveTime(obj) {
      let dateTime = new Date().toLocaleString("en-US", {
        timeZone: obj.gettimeZone(),
      });

      let partOfTime;
      var hour = new Date(dateTime).getHours();
      var minute = new Date(dateTime).getMinutes();
      var second = new Date(dateTime).getSeconds();

      hour == 0
        ? ((hour = 12), (partOfTime = "AM"))
        : hour < 12
        ? (partOfTime = "AM")
        : hour == 12
        ? (partOfTime = "PM")
        : ((partOfTime = "PM"), (hour = hour - 12));
      if (second < 10)
        obj.updateUIElementAttributeWithTheGivenValue(
          "time_in_seconds",
          "innerHTML",
          "0" + second
        );
      else
        obj.updateUIElementAttributeWithTheGivenValue(
          "time_in_seconds",
          "innerHTML",
          second
        );

      if (minute < 10)
        obj.updateUIElementAttributeWithTheGivenValue(
          "time_in_minutes",
          "innerHTML",
          "0" + minute + ": "
        );
      else
        obj.updateUIElementAttributeWithTheGivenValue(
          "time_in_minutes",
          "innerHTML",
          minute + ": "
        );

      if (hour < 10)
        obj.updateUIElementAttributeWithTheGivenValue(
          "time_in_hour",
          "innerHTML",
          "0" + hour + ": "
        );
      else
        obj.updateUIElementAttributeWithTheGivenValue(
          "time_in_hour",
          "innerHTML",
          hour + ": "
        );

      partOfTime == "PM"
        ? obj.updateUIElementAttributeWithTheGivenValue(
            "amimg",
            "src",
            "./ASSETS/pmState.svg"
          )
        : obj.updateUIElementAttributeWithTheGivenValue(
            "amimg",
            "src",
            "./ASSETS/amState.png"
          );
      obj.UpdateAmpmForNextfivehrs(hour, partOfTime);
    }
    clearInterval(timeout);
    timeout = setInterval(displayLiveTime, 0, this);
  }
  /**
   *
   * Update the Temperature in celsius ,in farenheit and humidity ,precipitation for the selected city
   * Display the temperature values as per the format for the selected city
   * @param {Array.<string>} temperatureCelsius city temperature
   * @return {void} nothing
   */
  updateTemperature(temperatureCelsius) {
    document.getElementById("temp-celsius").innerHTML =
      temperatureCelsius[0] + " " + temperatureCelsius[1];

    let temperatureFarenheit = this.gettemperature();
    temperatureFarenheit = temperatureFarenheit.split("°");
    temperatureFarenheit[0] = ((temperatureFarenheit[0] * 9) / 5 + 32).toFixed(
      1
    );
    document.getElementById("temp-farenheit").innerHTML =
      temperatureFarenheit[0] + " F";

    let humidityValue = this.gethumidity();
    document.getElementById("humidity_percentage").innerHTML =
      humidityValue.slice(0, humidityValue.length - 1);

    let precipitationValue = this.getprecipitation();
    document.getElementById("precipitation_percentage").innerHTML =
      precipitationValue.slice(0, precipitationValue.length - 1);
  }
  /**
   *
   * Update the source of the weather images based the temperature and its condition
   * If the temperature value is between 23 and 29, update source with cloud image
   * If the temperature value is less than 18, update source with rainy image
   * If the temperature value is  between 23 and 29, update source with windy image
   * If the temperature value is greater than 29, update source with sunny image
   * @param {number} tempAfterEveryHour temperature of the city for every one hour
   * @param {string} tempIcon id name of the image source
   * @return {void} nothing
   */
  updateImageSource(tempAfterEveryHour, tempIcon) {
    if (tempAfterEveryHour >= 23 && tempAfterEveryHour <= 29)
      this.updateUIElementAttributeWithTheGivenValue(
        tempIcon,
        "src",
        "./ASSETS/cloudyIcon.svg"
      );
    else if (tempAfterEveryHour < 18)
      this.updateUIElementAttributeWithTheGivenValue(
        tempIcon,
        "src",
        "./ASSETS/rainyIconBlack.svg"
      );
    else if (tempAfterEveryHour >= 18 && tempAfterEveryHour <= 22)
      this.updateUIElementAttributeWithTheGivenValue(
        tempIcon,
        "src",
        "./ASSETS/windyIcon.svg"
      );
    else if (tempAfterEveryHour > 29)
      this.updateUIElementAttributeWithTheGivenValue(
        tempIcon,
        "src",
        "./ASSETS/sunnyIconBlack.svg"
      );
  }
  /**
   *
   * Update the temperature in celsius for the next five hours from the current time for the
   * selected city
   * @params {} nothing
   * @return {void} nothing
   */
  async fetchAndUpdateTemperatureForNextfivehrs(selectedCity) {
    let tempList = weatherData[selectedCity].nextFiveHrs;

    for (var count = 1; count <= 5; count++) {
      let celsiusTemperature = `temp-after-${count}hour`;
      let tempIcon = `icon_based_tempafter-${count}hour`;

      let tempAfterEveryHour = tempList[count - 1].slice(
        0,
        tempList[count - 1].length - 2
      );
      this.updateUIElementAttributeWithTheGivenValue(
        celsiusTemperature,
        "innerHTML",
        tempAfterEveryHour
      );
      this.updateImageSource(tempAfterEveryHour, tempIcon);
    }
  }
  /**
   *
   * This function is used to update the UI Element with the given value.
   * @param {string} UIElementID  ID name of the element
   * @param {string} UIAttribute  Atrribute need to be change
   * @param {string} valueToUpdate value to change
   * @return {void} nothing
   */
  updateUIElementAttributeWithTheGivenValue(
    UIElementID,
    UIAttribute,
    valueToUpdate
  ) {
    if (UIAttribute == "src")
      document.getElementById(UIElementID).src = valueToUpdate;
    else if (UIAttribute == "innerHTML")
      document.getElementById(UIElementID).innerHTML = valueToUpdate;
    else if (UIAttribute == "value")
      document.getElementById(UIElementID).value = valueToUpdate;
    else if (UIAttribute == "borderBottom")
      document.getElementById(UIElementID).style.borderBottom = valueToUpdate;
    else if (UIAttribute == "paddingBottom")
      document.getElementById(UIElementID).style.paddingBottom = valueToUpdate;
    else if (UIAttribute == "display")
      document.getElementById(UIElementID).style.display = valueToUpdate;
    else if (UIAttribute == "max")
      document.getElementById(UIElementID).max = valueToUpdate;
  }
  /**
   *
   * validate the cityname , if not it will display Nil and warning image.
   * By using the object reference , Nil value is assigned.
   * Warning image replaces with the all image sources.
   * @param {reference} dateOfaCity Object reference
   * @return {void} nothing
   */
  updateUIWithNil(dateOfaCity) {
    clearInterval(timeout);
    this.updateUIElementAttributeWithTheGivenValue(
      "icon",
      "src",
      "./ASSETS/warning.svg"
    );
    dateOfaCity[0].innerHTML = emptyValue;
    this.updateUIElementAttributeWithTheGivenValue(
      "time_in_seconds",
      "innerHTML",
      ""
    );
    this.updateUIElementAttributeWithTheGivenValue(
      "time_in_minutes",
      "innerHTML",
      ""
    );
    this.updateUIElementAttributeWithTheGivenValue(
      "time_in_hour",
      "innerHTML",
      emptyValue
    );
    this.updateUIElementAttributeWithTheGivenValue(
      "amimg",
      "src",
      "./ASSETS/warning.svg"
    );
    this.updateUIElementAttributeWithTheGivenValue(
      "temp-celsius",
      "innerHTML",
      emptyValue
    );
    this.updateUIElementAttributeWithTheGivenValue(
      "temp-farenheit",
      "innerHTML",
      emptyValue
    );
    this.updateUIElementAttributeWithTheGivenValue(
      "humidity_percentage",
      "innerHTML",
      emptyValue
    );
    this.updateUIElementAttributeWithTheGivenValue(
      "precipitation_percentage",
      "innerHTML",
      emptyValue
    );
    this.updateUIElementAttributeWithTheGivenValue(
      "present_temperature",
      "innerHTML",
      emptyValue
    );
    this.updateUIElementAttributeWithTheGivenValue(
      "present_time",
      "innerHTML",
      emptyValue
    );
    this.updateUIElementAttributeWithTheGivenValue(
      "icon_based_present_temp",
      "src",
      "./ASSETS/warning.svg"
    );
    for (var count = 1; count <= 5; count++) {
      let idName = `time-after-${count}hour`;
      this.updateUIElementAttributeWithTheGivenValue(
        idName,
        "innerHTML",
        emptyValue
      );
    }
    for (var count = 1; count <= 5; count++) {
      let celsiusTemperature = `temp-after-${count}hour`;
      let tempIcon = `icon_based_tempafter-${count}hour`;
      this.updateUIElementAttributeWithTheGivenValue(
        celsiusTemperature,
        "innerHTML",
        emptyValue
      );
      this.updateUIElementAttributeWithTheGivenValue(
        tempIcon,
        "src",
        "./ASSETS/warning.svg"
      );
    }
    document.getElementById("city_list").style.border = "2px solid red";
    document.getElementById("warning").style.display = "block";
    //alert("Invalid Cityname!, Please enter a valid cityname.");
  }
  /**
   *
   * Update source of the weather images based on the temperature value
   * am ,pm value for the time is updated.
   * @param {number} hour
   * @param {string} partOfTime
   * @return {void} nothing
   */
  UpdateAmpmForNextfivehrs(hour, partOfTime) {
    let timeIterator = hour;
    for (var count = 1; count <= 5; count++) {
      let idName = `time-after-${count}hour`;
      timeIterator++;
      let timeValue = timeIterator;

      timeValue == 12 && partOfTime == "PM"
        ? (partOfTime = "AM")
        : timeValue == 12 && partOfTime == "AM"
        ? (partOfTime = "PM")
        : timeValue > 12 && partOfTime == "PM"
        ? ((timeValue = timeValue - 12), (partOfTime = "PM"))
        : timeValue > 12 && partOfTime == "AM"
        ? ((timeValue = timeValue - 12), (partOfTime = "AM"))
        : timeValue < 12 && partOfTime == "PM"
        ? (partOfTime = "PM")
        : (partOfTime = "AM");

      document.getElementById(idName).innerHTML = timeValue + " " + partOfTime;
    }
  }
}

//loading page
let weatherData;
let cityInterval;
let body_division = document.getElementsByClassName("body-container");
if (weatherData == undefined) {
  body_division[0].style.display = "none";
  document.body.style.backgroundColor = "rgb(51,73,95)";
  document.body.style.backgroundImage = "url('../ASSETS/load.gif')";
  document.body.style.backgroundSize = "60%";
  document.body.style.backgroundRepeat = "no-repeat";
  document.body.style.backgroundPosition = "top";
}
//Function call to fetch the weather data of all cities
weatherData = await getWeatherData();
// console.log("weatherData: ", weatherData);

/**
 * It will fetch data from server through api call and
 * update data to the UI.
 *@params {} nothing
 *@return {void}
 */
async function fetchDataFromServerAndUpdateDataOnUI() {
  weatherData = await getWeatherData();
  utility.updateDataOnCityname();
  updateDataToTheCardAndTileContainer();
}

/**
 * It will update data on UI when the page loads.
 *@params {} nothing
 *@return {void} nothing
 */
function updateUIData() {
  utility.updateDataOnCityname();
  updateDataToTheCardAndTileContainer();
}

// update the city data for every four hours
setInterval(fetchDataFromServerAndUpdateDataOnUI, 14400000);

/**
 * It will update the temperature value of next five hours for every hour.
 *@params {} nothing
 *@return {void}
 */
function getNextFiveHrsTemperature() {
  clearInterval(cityInterval);
  cityInterval = setInterval(async () => {
    utility.updateDataOnCityname();
  }, 3600000);
}

// A listner to update the UI data whenever the city is selected
document
  .getElementById("city_list")
  .addEventListener("change", utility.updateDataOnCityname);

// condition to check whether the data is fetched and display UI with data
if (weatherData != undefined) {
  body_division[0].style.display = "flex";
  document.body.style.backgroundImage = "url('../ASSETS/background.png')";
  document.body.style.backgroundSize = "cover";
  utility.appendCitynameToDropdown(weatherData);
  updateUIData();
}

// middle section javascript

function updateDataToTheCardAndTileContainer() {
  /**
   * A Class which contains constructor and methods to populate the card details.
   * @return {void} nothing
   */
  class CardContainerDetails extends CurrentCityInformation {
    /**
     * A constructor function, in which the Object will be filtered and sorted.
     * @return {void} nothing
     */
    constructor() {
      super();
      this.sunnyList = Object.values(weatherData).filter(
        (value) =>
          parseInt(value.temperature) > 29 &&
          parseInt(value.humidity) < 50 &&
          parseInt(value.precipitation) >= 50
      );

      this.snowList = Object.values(weatherData).filter(
        (value) =>
          parseInt(value.temperature) >= 20 &&
          parseInt(value.temperature) <= 28 &&
          parseInt(value.humidity) > 50 &&
          parseInt(value.precipitation) < 50
      );

      this.rainyList = Object.values(weatherData).filter(
        (value) =>
          parseInt(value.temperature) < 20 && parseInt(value.humidity) >= 50
      );
      this.sortTheArrayBasedOnParticularCategory = function (
        arrayList,
        weatherCondition
      ) {
        /** Sort the sunny list data based on temperature */
        arrayList.sort((a, b) =>
          parseInt(a[weatherCondition]) < parseInt(b[weatherCondition]) ? 1 : -1
        );
      };
      this.getSunnylist = function () {
        return this.sunnyList;
      };
      this.getSnowlist = function () {
        return this.snowList;
      };
      this.getRainylist = function () {
        return this.rainyList;
      };
      this.sunnyDataList = {
        weathericonIdname: "sunny-icon",
        listOfCity: this.getSunnylist(),
        iconImage: "./ASSETS/sunnyIcon.svg",
      };
      this.snowDataList = {
        weathericonIdname: "snow-icon",
        listOfCity: this.getSnowlist(),
        iconImage: "./ASSETS/snowflakeIcon.svg",
      };
      this.rainyDataList = {
        weathericonIdname: "rainy-icon",
        listOfCity: this.getRainylist(),
        iconImage: "./ASSETS/rainyIcon.svg",
      };
      this.populateDetailsBasedOnIconSelected = function () {
        weathericonIdname = this.weathericonIdname;
        listOfCity = this.listOfCity;
        iconImage = this.iconImage;
      };
    }
    /**
     *
     * The function will create elements and populate the city name,temperature value to it and append
     * it to the card.
     * @param {object reference} cardDivision Object reference of the card division
     * @param {string} cityname name of the city
     * @param {string} iconImagePath weather Icon image source
     * @param {string} temperatureCelsius temperature value of a city
     */
    updateCitynameAndTemperatureInTheCard(
      cardDivision,
      cityname,
      iconImagePath,
      temperatureCelsius
    ) {
      let cityContentDivision = document.createElement("div");
      let nameOfCity = document.createElement("p");
      let iconTempDivision = document.createElement("div");
      let weatherIcon = document.createElement("img");
      let temperatureInCelsius = document.createElement("span");
      cardDivision.setAttribute("class", "card");
      cityContentDivision.setAttribute("class", "continent-content");
      nameOfCity.setAttribute("class", "city-name");
      nameOfCity.innerHTML = cityname;
      iconTempDivision.setAttribute("class", "temp-cardstyle");
      weatherIcon.src = iconImagePath;
      weatherIcon.style.width = "25px";
      temperatureInCelsius.setAttribute("class", "card-temp");
      temperatureInCelsius.innerHTML = temperatureCelsius;
      cardContainer.appendChild(cardDivision);
      cardDivision.appendChild(cityContentDivision);
      cityContentDivision.appendChild(nameOfCity);
      cityContentDivision.appendChild(iconTempDivision);
      iconTempDivision.appendChild(weatherIcon);
      iconTempDivision.appendChild(temperatureInCelsius);
    }
    /**
     *
     * The function will create elements and populate the live date and time to it and append
     * it to the card.
     * @param {object reference} cardDivision
     * @param {string} liveDateOfCity
     * @param {string} cityname
     */
    updateDateAndTimeInTheCard(cardDivision, liveDateOfCity, cityname) {
      let time = document.createElement("p");
      let date = document.createElement("p");
      date.setAttribute("class", "card-date-time");
      date.innerHTML = liveDateOfCity;
      time.setAttribute("class", "card-date-time");
      this.displayLiveTimeToTheCity(cityname.toLowerCase(), time);
      setInterval(
        this.displayLiveTimeToTheCity,
        1000,
        cityname.toLowerCase(),
        time
      );
      cardDivision.appendChild(time);
      cardDivision.appendChild(date);
    }
    /**
     *
     * Whenever this function is invoked, it will set the background image as the City icon and
     * add styles to it.
     * @param {object reference} cardDivision
     * @param {string} cityImage
     */
    updateCityIconInTheCard(cardDivision, cityImage) {
      cardDivision.style.backgroundImage = "url(" + cityImage + ")";
      cardDivision.style.backgroundRepeat = "no-repeat";
      cardDivision.style.backgroundPosition = "bottom right";
      cardDivision.style.backgroundSize = "65%";
    }
    /**
     * The function will create elements and populate the humidity and precipitation to it and append
     * it to the card.
     * @param {object reference} cardDivision
     * @param {string} humidityIconImgPath
     * @param {string} humidityValue
     * @param {string} precipitationIconImgPath
     * @param {string} precipitationValue
     */
    updateHumidityAndPrecipitationInTheCard(
      cardDivision,
      humidityIconImgPath,
      humidityValue,
      precipitationIconImgPath,
      precipitationValue
    ) {
      let humidityDivision = document.createElement("div");
      let precipitationDivision = document.createElement("div");
      let humidityIcon = document.createElement("img");
      let humidityInPercentage = document.createElement("span");
      let precipitationIcon = document.createElement("img");
      let precipitationInPercentage = document.createElement("span");
      humidityIcon.src = humidityIconImgPath;
      humidityIcon.style.width = "16px";
      humidityInPercentage.innerHTML = humidityValue;
      humidityInPercentage.setAttribute("class", "rainy-temp");
      precipitationIcon.src = precipitationIconImgPath;
      precipitationIcon.style.width = "16px";
      precipitationInPercentage.innerHTML = precipitationValue;
      precipitationInPercentage.setAttribute("class", "rainy-temp");
      cardDivision.appendChild(humidityDivision);
      cardDivision.appendChild(precipitationDivision);
      humidityDivision.appendChild(humidityIcon);
      humidityDivision.appendChild(humidityInPercentage);
      precipitationDivision.appendChild(precipitationIcon);
      precipitationDivision.appendChild(precipitationInPercentage);
    }
    /**
     *
     * whenever The function is invoked , it will create card and
     * populate the given values with respect to the weather icon selected.
     * All styles are added to the element
     * @param {string} cityname name of the city
     * @param {string} iconImagePath weather icon image source
     * @param {string} temperatureCelsius  temperature value in celsius for the city
     * @param {string} liveDateOfCity    live date of the city
     * @param {string} humidityIconImgPath  humidity icon image source
     * @param {string} humidityValue humidity value in percentage
     * @param {string} precipitationIconImgPath  precipitation icon image source
     * @param {string} precipitationValue precipitation value in percentage
     * @param {string} cityImage city image source
     * @return {void} nothing
     */
    createCardAndUpdateDataWithTheGivenValue(
      cityname,
      iconImagePath,
      temperatureCelsius,
      liveDateOfCity,
      humidityIconImgPath,
      humidityValue,
      precipitationIconImgPath,
      precipitationValue,
      cityImage
    ) {
      let cardDivision = document.createElement("div");
      this.updateCitynameAndTemperatureInTheCard(
        cardDivision,
        cityname,
        iconImagePath,
        temperatureCelsius
      );
      this.updateDateAndTimeInTheCard(cardDivision, liveDateOfCity, cityname);
      this.updateCityIconInTheCard(cardDivision, cityImage);
      this.updateHumidityAndPrecipitationInTheCard(
        cardDivision,
        humidityIconImgPath,
        humidityValue,
        precipitationIconImgPath,
        precipitationValue
      );
    }
    /**
     *
     * This function will decides, how many card to display on UI and
     * create the card and populate data and display it in UI based on the selected Weather Icon
     * @param {string} weathericonIdname Id name of the weather icon ,it is used to change values
     * @param {Array} weatherList Array list to display data to the UI
     * @param {string} weathericonImgPath weather icon image source
     * @param {number} noOfCitiesToDisplay count of the city to display in UI
     * @return {void} nothing
     */
    createCardToTheSelectedCityAndPopulateCityDetails(
      weathericonIdname,
      weatherList,
      weathericonImgPath,
      noOfCitiesToDisplay
    ) {
      noOfCitiesToDisplay = this.updateSpinnerValueBasedOnTheGivenCondition(
        weatherList,
        noOfCitiesToDisplay
      );
      let count = 0;
      for (let city of weatherList) {
        if (count < noOfCitiesToDisplay) {
          let liveDateOfCity = this.updateDateBasedOnCity(
            "null",
            weathericonIdname
          );
          let cityImage = this.updateIconImageSource(
            city.cityName,
            weathericonIdname
          );
          this.createCardAndUpdateDataWithTheGivenValue(
            city.cityName,
            weathericonImgPath,
            city.temperature,
            liveDateOfCity,
            "./ASSETS/humidityIcon.svg",
            city.humidity,
            "./ASSETS/precipitationIcon.svg",
            city.precipitation,
            cityImage
          );
          this.hideTheScrollArrow();
          count++;
        }
      }
    }
    /**
     *
     * whenever the Icon is selected , there will be appearing of blue line under the Icon.
     * From DOM event listener the idname of the weather icon is passed to this function based on that,
     * it functions
     * @param {string} weathericonIdname Id name of the weather icon ,it is used to change values
     * @return {void} nothing
     */
    selectTheIconWhichIsClicked(weathericonIdname) {
      if (weathericonIdname == "sunny-icon") {
        this.updateUIElementAttributeWithTheGivenValue(
          "sun-image",
          "borderBottom",
          "2px solid skyblue"
        );
        this.updateUIElementAttributeWithTheGivenValue(
          "snow-image",
          "borderBottom",
          0
        );
        this.updateUIElementAttributeWithTheGivenValue(
          "rainy-image",
          "borderBottom",
          0
        );
        this.updateUIElementAttributeWithTheGivenValue(
          "sun-image",
          "paddingBottom",
          "3px"
        );
      } else if (weathericonIdname == "snow-icon") {
        this.updateUIElementAttributeWithTheGivenValue(
          "snow-image",
          "borderBottom",
          "2px solid skyblue"
        );
        this.updateUIElementAttributeWithTheGivenValue(
          "sun-image",
          "borderBottom",
          0
        );
        this.updateUIElementAttributeWithTheGivenValue(
          "rainy-image",
          "borderBottom",
          0
        );
        this.updateUIElementAttributeWithTheGivenValue(
          "snow-image",
          "paddingBottom",
          "3px"
        );
      } else if (weathericonIdname == "rainy-icon") {
        this.updateUIElementAttributeWithTheGivenValue(
          "rainy-image",
          "borderBottom",
          "2px solid skyblue"
        );
        this.updateUIElementAttributeWithTheGivenValue(
          "sun-image",
          "borderBottom",
          0
        );
        this.updateUIElementAttributeWithTheGivenValue(
          "snow-image",
          "borderBottom",
          0
        );
        this.updateUIElementAttributeWithTheGivenValue(
          "rainy-image",
          "paddingBottom",
          "3px"
        );
      }
    }
    /**
     *
     * The function will set the value of the spinner based on the condition provided for
     * the particular weather.
     * @param {Array} weatherList array of objects
     * @param {number} noOfCitiesToDisplay number of city to display in the UI
     * @return {number} noOfCitiesToDisplay -number of city to display in the UI
     */
    updateSpinnerValueBasedOnTheGivenCondition(
      weatherList,
      noOfCitiesToDisplay
    ) {
      let lengthOfList = weatherList.length;
      if (lengthOfList < noOfCitiesToDisplay) {
        noOfCitiesToDisplay = lengthOfList;
      }
      if (noOfCitiesToDisplay < 3) noOfCitiesToDisplay = 3;
      else if (noOfCitiesToDisplay > 10) noOfCitiesToDisplay = 10;
      if (lengthOfList <= 3) {
        spinner = 3;
        this.updateUIElementAttributeWithTheGivenValue(
          "numberofcities",
          "max",
          3
        );
        this.updateUIElementAttributeWithTheGivenValue(
          "numberofcities",
          "value",
          3
        );
      } else {
        this.updateUIElementAttributeWithTheGivenValue(
          "numberofcities",
          "max",
          10
        );
      }
      return noOfCitiesToDisplay;
    }
    /**
     *
     * To update the Live time of the city in the card.
     * By using date object and its methods live date is fetched and  using hour value am or pm is decided.
     * setinterval used to repeatedly call the displayLiveTime function
     * @param {string} nameOfTheCity name of the city
     * @param {object reference} time object reference
     */
    displayLiveTimeToTheCity(nameOfTheCity, time) {
      let dateTime = new Date().toLocaleString("en-US", {
        timeZone: weatherData[nameOfTheCity].timeZone,
      });

      let partOfTime;
      var hour = new Date(dateTime).getHours();
      var minute = new Date(dateTime).getMinutes();

      hour == 0
        ? ((hour = 12), (partOfTime = "AM"))
        : hour < 12
        ? (partOfTime = "AM")
        : hour == 12
        ? (partOfTime = "PM")
        : ((partOfTime = "PM"), (hour = hour - 12));

      hour < 10 ? (hour = "0" + hour + ":") : (hour = hour + ":");
      minute < 10 ? (minute = "0" + minute) : (minute = minute);

      dateTime = hour + minute + " " + partOfTime;
      time.innerHTML = dateTime;
    }
    /**
     * While changing the values in spinner,createCardToTheSelectedCityAndPopulateCityDetails function will
     * be called , which will create card and populate values in it.
     * Based on the value in spinner , the cards will display
     * @params {}
     * @return {void}
     */
    noOfCitiesToDisplayInUI() {
      let displayNoOfCity = document.getElementById("numberofcities");
      spinner = displayNoOfCity.value;
      if (spinner > 10) {
        spinner = 10;
      }
      cardContainer.replaceChildren();
      cardObj.createCardToTheSelectedCityAndPopulateCityDetails(
        weathericonIdname,
        listOfCity,
        iconImage,
        spinner
      );
    }
    /**
     * It will hide the carousel button , when the card is less than or equal to 4.
     * It displays the button, when it card exceeds 4 and as well the screen size is small
     *@params {}
     *@return {void}
     */
    hideTheScrollArrow() {
      let lengthOfContainer = cardContainer.clientWidth;
      let lengthOfWholeCity = cardContainer.scrollWidth;
      let carouselDivision = document.getElementsByClassName("carousel-div");
      if (lengthOfWholeCity <= lengthOfContainer) {
        carouselDivision[0].style.display = "none";
        carouselDivision[1].style.display = "none";
        cardObj.updateUIElementAttributeWithTheGivenValue(
          "left-scroll",
          "display",
          "none"
        );
        cardObj.updateUIElementAttributeWithTheGivenValue(
          "right-scroll",
          "display",
          "none"
        );
      } else {
        carouselDivision[0].style.display = "flex";
        carouselDivision[1].style.display = "flex";
        cardObj.updateUIElementAttributeWithTheGivenValue(
          "left-scroll",
          "display",
          "flex"
        );
        cardObj.updateUIElementAttributeWithTheGivenValue(
          "right-scroll",
          "display",
          "flex"
        );
      }
    }
    /**
     * whenever the particular Icon is clicked, this function is invoked.
     * this further calls two functions , it select the weather icon and create cards and populate details.
     *@params {}
     * @return {function}
     */
    updateContainerWithCitiesInformationBasedOnWeatherIconSelected() {
      return (function (obj) {
        obj.selectTheIconWhichIsClicked(weathericonIdname);
        cardContainer.replaceChildren();
        obj.createCardToTheSelectedCityAndPopulateCityDetails(
          weathericonIdname,
          listOfCity,
          iconImage,
          spinner
        );
      })(this);
    }
    /**
     * It allows only the value between 3 and 10 , it restricts
     * If it exceeds 10, it automatically changes to 10
     * If it is less 3 , it automatically changes to 3
     * @params {}
     * @return {void}
     */
    validateTheSpinner() {
      parseInt(this.value) < 3
        ? cardObj.updateUIElementAttributeWithTheGivenValue(
            "numberofcities",
            "value",
            3
          )
        : parseInt(this.value) > 10
        ? cardObj.updateUIElementAttributeWithTheGivenValue(
            "numberofcities",
            "value",
            10
          )
        : cardObj.updateUIElementAttributeWithTheGivenValue(
            "numberofcities",
            "value",
            parseInt(this.value)
          );
    }
  }
  // Object creation
  let cardObj = new CardContainerDetails();

  /* A variable to keep on update with the value of number of cities */
  var spinner = 4;

  var weathericonIdname = "sunny-icon";
  var listOfCity = cardObj.getSunnylist();
  var iconImage = "./ASSETS/sunnyIcon.svg";

  /* Filter the data based on the condition and forms new list */
  cardObj.sortTheArrayBasedOnParticularCategory(
    cardObj.getSunnylist(),
    "temperature"
  );
  cardObj.sortTheArrayBasedOnParticularCategory(
    cardObj.getSnowlist(),
    "precipitation"
  );
  cardObj.sortTheArrayBasedOnParticularCategory(
    cardObj.getRainylist(),
    "humidity"
  );

  // card container's object reference
  const cardContainer = document.getElementById("city-card");
  cardContainer.replaceChildren();

  document.getElementById("sunny-icon").addEventListener("click", () => {
    cardObj.populateDetailsBasedOnIconSelected.call(cardObj.sunnyDataList);
    cardObj.updateContainerWithCitiesInformationBasedOnWeatherIconSelected();
  });

  document.getElementById("snow-icon").addEventListener("click", () => {
    cardObj.populateDetailsBasedOnIconSelected.call(cardObj.snowDataList);
    cardObj.updateContainerWithCitiesInformationBasedOnWeatherIconSelected();
  });

  document.getElementById("rainy-icon").addEventListener("click", () => {
    cardObj.populateDetailsBasedOnIconSelected.call(cardObj.rainyDataList);
    cardObj.updateContainerWithCitiesInformationBasedOnWeatherIconSelected();
  });

  document
    .getElementById("numberofcities")
    .addEventListener("change", cardObj.noOfCitiesToDisplayInUI);
  cardObj.createCardToTheSelectedCityAndPopulateCityDetails(
    weathericonIdname,
    listOfCity,
    iconImage,
    spinner
  );

  document.getElementById("left-scroll").addEventListener("click", () => {
    setTimeout(() => (cardContainer.scrollLeft -= 530), 200);
  });
  document.getElementById("right-scroll").addEventListener("click", () => {
    setTimeout(() => (cardContainer.scrollLeft += 530), 200);
  });

  document
    .getElementById("numberofcities")
    .addEventListener("input", cardObj.validateTheSpinner);

  setInterval(cardObj.hideTheScrollArrow, 1000);

  // bottom section
  /**
   * A Class which contains constructor and methods to populate the tile details.
   * @return {void} nothing
   */
  class TileContainerDetails extends CardContainerDetails {
    /**
     * A constructor function ,in which data is extracted.
     * @return {void} nothing
     */
    constructor() {
      super();
      this.weatherDetails = Object.entries(weatherData).map(
        (element) => element[1]
      );
    }
    /**
     *
     * This function will sort the array based on the criteria and sorting order.
     * @params {}   nothing
     * @return {void} nothing
     */
    sortTheArrayBasedOnTheGivenPreference() {
      this.weatherDetails.sort((a, b) => {
        if (a.timeZone.split("/")[0] === b.timeZone.split("/")[0]) {
          return temperatureArrow.name == "temperature-arrow-up"
            ? parseInt(a.temperature) < parseInt(b.temperature)
              ? 1
              : -1
            : parseInt(a.temperature) < parseInt(b.temperature)
            ? -1
            : 1;
        } else
          return continentArrow.name == "continent-arrow-down"
            ? a.timeZone.split("/")[0] > b.timeZone.split("/")[0]
              ? 1
              : -1
            : a.timeZone.split("/")[0] > b.timeZone.split("/")[0]
            ? -1
            : 1;
      });
    }
    /**
     *
     * The funtion will create elements and populate continent name and temperature to the tile.
     * @param {object reference} tileContentDivision Object reference of the tile division
     * @param {string} timezone Timezone of the city
     * @param {string} temperatureCelsius temperature of the city
     */
    updateContinentnameAndTemperatureInTheTile(
      tileContentDivision,
      timezone,
      temperatureCelsius
    ) {
      let continentName = document.createElement("p");
      let temperatureOfContinent = document.createElement("p");
      tileContainer.setAttribute("class", "cities-with-temp-info");
      tileContentDivision.setAttribute("class", "tile-content");
      continentName.setAttribute("class", "continent-name");
      continentName.innerHTML = timezone.split("/")[0];
      temperatureOfContinent.setAttribute("class", "continent-temp");
      temperatureOfContinent.innerHTML = temperatureCelsius;
      tileContainer.appendChild(tileContentDivision);
      tileContentDivision.appendChild(continentName);
      tileContentDivision.appendChild(temperatureOfContinent);
    }
    /**
     *
     * The function will create elements and populate state name and live time to the tile.
     * @param {object reference} tileContentDivision  Object reference of the tile division
     * @param {string} cityname name of the city
     */
    updateStatenameAndTimeInTheTile(tileContentDivision, cityname) {
      let stateName = document.createElement("p");
      let liveTime = document.createElement("span");
      stateName.setAttribute("class", "state-name");
      stateName.innerHTML = cityname + ", ";
      this.displayLiveTimeToTheCity(cityname.toLowerCase(), liveTime);
      setInterval(
        this.displayLiveTimeToTheCity,
        1000,
        cityname.toLowerCase(),
        liveTime
      );
      tileContentDivision.appendChild(stateName);
      stateName.appendChild(liveTime);
    }
    /**
     *
     * The function will create elements and populate humidity value to the tile.
     * @param {object reference} tileContentDivision  Object reference of the tile division
     * @param {string} humidityValue humidity of the city
     */
    updateHumidityInTheTile(tileContentDivision, humidityValue) {
      let humidityDivision = document.createElement("p");
      let humidityIcon = document.createElement("img");
      let humidityInPercentage = document.createElement("span");
      humidityDivision.setAttribute("class", "humidity-representation");
      humidityIcon.src = "./ASSETS/humidityIcon.svg";
      humidityIcon.setAttribute("id", "humidity-img");
      humidityInPercentage.setAttribute("class", "humidity-per");
      humidityInPercentage.innerHTML = humidityValue;
      tileContentDivision.appendChild(humidityDivision);
      humidityDivision.appendChild(humidityIcon);
      humidityDivision.appendChild(humidityInPercentage);
    }
    /**
     * This will create the elements for the tile and set style attributes and
     * populate the given values to it
     * @param {string} cityname name of the city
     * @param {string} timezone timezone of the city
     * @param {string} temperatureCelsius temperature in celsius format of the city
     * @param {string} humidityValue humidity in percentage of the city
     */
    createTileAndPopulateCityDetails(
      cityname,
      timezone,
      temperatureCelsius,
      humidityValue
    ) {
      let tileContentDivision = document.createElement("div");
      this.updateContinentnameAndTemperatureInTheTile(
        tileContentDivision,
        timezone,
        temperatureCelsius
      );
      this.updateStatenameAndTimeInTheTile(tileContentDivision, cityname);
      this.updateHumidityInTheTile(tileContentDivision, humidityValue);
    }
    /**
     * Create a tile and populate the continent details to the tile container.
     * @param {array} weatherList
     * @return {void} nothing
     */
    createTile(weatherList) {
      tileContainer.replaceChildren();
      let count = 1;
      for (let city of weatherList) {
        if (count <= 12) {
          this.createTileAndPopulateCityDetails(
            city.cityName,
            city.timeZone,
            city.temperature,
            city.humidity
          );
          count++;
        }
      }
    }
    /**
     * Update the image source of the arrow and name attribute,
     * sort the array list based on the continent name.
     * @params {}
     * @return {void} nothing
     */
    updateTheArrowImageAndContinentOrder() {
      if (continentArrow.name == "continent-arrow-down") {
        continentArrow.name = "continent-arrow-up";
        this.updateUIElementAttributeWithTheGivenValue(
          "sort-by-continent",
          "src",
          "/ASSETS/arrowUp.svg"
        );
        this.sortTheArrayBasedOnTheGivenPreference();
        this.createTile(this.weatherDetails);
      } else {
        continentArrow.name = "continent-arrow-down";
        this.updateUIElementAttributeWithTheGivenValue(
          "sort-by-continent",
          "src",
          "/ASSETS/arrowDown.svg"
        );
        this.sortTheArrayBasedOnTheGivenPreference();
        this.createTile(this.weatherDetails);
      }
    }
    /**
     * Update the image source of the arrow and name attribute,
     * sort the array list based on the temperature.
     * @params {}
     * @return {void} nothing
     */
    updateTheArrowImageAndtemperatureOrder() {
      if (temperatureArrow.name == "temperature-arrow-up") {
        temperatureArrow.name = "temperature-arrow-down";
        this.updateUIElementAttributeWithTheGivenValue(
          "sort-by-temperature",
          "src",
          "/ASSETS/arrowDown.svg"
        );
        this.sortTheArrayBasedOnTheGivenPreference();
        this.createTile(this.weatherDetails);
      } else {
        temperatureArrow.name = "temperature-arrow-up";
        this.updateUIElementAttributeWithTheGivenValue(
          "sort-by-temperature",
          "src",
          "/ASSETS/arrowUp.svg"
        );
        this.sortTheArrayBasedOnTheGivenPreference();
        this.createTile(this.weatherDetails);
      }
    }
  }
  // Object creation
  let tileObj = new TileContainerDetails();
  /*
   * Bottom tile container's object reference
   * Weather details is an array, that contains the city weather information
   */
  var tileContainer = document.getElementById("continent-wise-list");
  tileContainer.replaceChildren();
  let continentArrow = document.getElementById("sort-by-continent");
  let temperatureArrow = document.getElementById("sort-by-temperature");

  /**
   * The function is called whenever the page loads.
   * @params{}
   * @return{void} nothing
   */
  function createTileOnLoad() {
    tileObj.sortTheArrayBasedOnTheGivenPreference();
    tileObj.createTile(tileObj.weatherDetails);
  }

  /**
   * Whenever the page is loaded,the DOM event triggers and calls
   * createTileOnLoad function to create tiles with continent details.
   */
  document.getElementById("continent-wise-list").onload = createTileOnLoad();

  /**
   * Whenever the arrow is clicked, the dom event triggers and calls the function.
   */
  document.getElementById("sort-by-continent").addEventListener("click", () => {
    tileObj.updateTheArrowImageAndContinentOrder();
  });
  document
    .getElementById("sort-by-temperature")
    .addEventListener("click", () => {
      tileObj.updateTheArrowImageAndtemperatureOrder();
    });
}
export { cityInterval };
export { CurrentCityInformation };
export { getNextFiveHrsTemperature };
