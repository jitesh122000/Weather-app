// import "./style.css"
// import { gerWeather } from "./weatherapi";

import { gerWeather } from "./apiCall";

const timeEl = document.getElementById('time');
const dateEl = document.getElementById('date');
const dayEl = document.getElementById('day');
const currentWeatherItemsEl = document.getElementById('current-weather-items');
const timezone = document.getElementById('time-zone');
const countryEl = document.getElementById('country');
const weatherForecastEl = document.getElementById('weather-forecast');
const currentTempEl = document.getElementById('current-temp');

const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];




setInterval(()=>{
    const time = new Date();
    const month= time.getMonth();
    const date= time.getDate();
    const day= time.getDay();
    const hour= time.getHours();
    const hoursIn12Formate = hour >= 13 ? hour % 12 : hour
    const minutes = time.getMinutes();
    const minute = minutes >=10 ? minutes : "0"+minutes
    const amPm = hour >=13 ? 'PM' : 'AM'

    timeEl.innerHTML = hoursIn12Formate + ":"+minute+`<span id="am-pm">${amPm}</span>`

    dateEl.innerHTML = days[day] + ", " +date+ " "+months[month] 
    
    dayEl.innerHTML = days[day]

    // console.log(hoursIn12Formate + ":"+minute+""+ amPm)


},1000);

gerWeather(17.3850, 78.4867, Intl.DateTimeFormat().resolvedOptions().timeZone).then(
  // data =>{
  //   console.log(data)
  // }
  renderWeather
).catch(e => {
  console.error(e)
  alert("Error getting Weather")
})

function renderWeather({current, daily, hourly}){
  renderCurrentWeather(current)
  renderDailyWeather(daily)
  renderHourlyWeather(hourly)
  document.body.classList.remove("blurred")
}

function setValue(selector, value, { parent = document } = {}) {
  parent.querySelector(`[data-${selector}]`).textContent = value
}

// function getIconUrl(iconCode){
//   return `icons/${ICON_MAP.get(iconCode)}.svg`
// }

// const currentIcon = document.querySelector("[data-current-icon]")
function renderCurrentWeather(current){
  // currentIcon.src = getIconUrl(current.iconCode)
  setValue("current-temp", current.currentTemp)
  setValue("current-high", current.highTemp)
  setValue("current-low", current.lowTemp)
  // setValue("current-fl-high", current.highFeelsLike)
  // setValue("current-fl-low", current.lowFeelsLike)
  setValue("current-wind", current.windSpeed)
  setValue("current-precip", current.precip)
  setValue("current-humidity", current.humidity)

}

const DAY_FORMATTER = new Intl.DateTimeFormat(undefined, { weekday: "long" })
const dailySection = document.querySelector("[data-day-section]")
const dayCardTemplate = document.getElementById("day-card-template")
function renderDailyWeather(daily) {
dailySection.innerHTML = ""
let isFirstIteration = true;

daily.forEach(day => {
  if (isFirstIteration) {
    isFirstIteration = false;
    return; // Skip the first iteration
  }

  const element = dayCardTemplate.content.cloneNode(true);
  setValue("temp-max", day.maxTemp, { parent: element });
  setValue("temp-min", day.minTemp, { parent: element });
  setValue("date", DAY_FORMATTER.format(day.timestamp), { parent: element });
  // element.querySelector("[data-icon]").src = getIconUrl(day.iconCode);
  dailySection.append(element);
});
}

const HOUR_FORMATTER = new Intl.DateTimeFormat(undefined, { hour: "numeric", hour12: true })
const hourlySection = document.querySelector("[data-hour-section]")
const hourRowTemplate = document.getElementById("hour-row-template")
function renderHourlyWeather(hourly) {
hourlySection.innerHTML = ""
let counter = 0;

hourly.forEach(hour => {
  if (counter >= 4) {
    return; // Break the loop after four iterations
  }

  const element = hourRowTemplate.content.cloneNode(true);
  setValue("temp", hour.temp, { parent: element });
  setValue("fl-temp", hour.feelsLike, { parent: element });
  setValue("wind", hour.windSpeed, { parent: element });
  setValue("precip", hour.precip, { parent: element });
  setValue("day", DAY_FORMATTER.format(hour.timestamp), { parent: element });
  setValue("time", HOUR_FORMATTER.format(hour.timestamp), { parent: element });
  // element.querySelector("[data-icon]").src = getIconUrl(hour.iconCode);
  hourlySection.append(element);

  counter++;
});
}
