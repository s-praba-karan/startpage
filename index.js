'use strict';

//////////////////////////////////////////////////////////////////////////////////
// Dark Mode and Light Mode

// get the intitial dark mode state
let darkMode = localStorage.getItem('darkMode');

// dark mode toggle. #dark id on the moon icon from font awesome
const darkModeToggle = document.getElementById('dark');

const enableDarkMode = () => {
  document.querySelector('body').classList.remove('theme-light');
  document.querySelector('body').classList.add('theme-dark');

  // Set localstorage to darkMode enabled
  localStorage.setItem('darkMode', 'enabled');
};

const disableDarkMode = () => {
  document.querySelector('body').classList.remove('theme-dark');
  document.querySelector('body').classList.add('theme-light');

  // Set localstorage to darkMode disabled
  localStorage.setItem('darkMode', null);
};

// checks local storage for status of dark mode
darkMode === 'enabled' ? enableDarkMode() : disableDarkMode();

// click event listener for moon icon
darkModeToggle.addEventListener('click', () => {
  darkMode = localStorage.getItem('darkMode');

  darkMode !== 'enabled' ? enableDarkMode() : disableDarkMode();
});

//////////////////////////////////////////////////////////////////////////////////
// Clock Function

// update clock function
function updateClock() {
  let date = new Date();
  let hours = date.getHours();
  let minutes = date.getMinutes();
  let ampm = hours >= 12 ? 'pm' : 'am';
  hours = hours % 12;
  hours = hours ? hours : 12;
  minutes = minutes < 10 ? `0${minutes}` : minutes;
  let time = `${hours}:${minutes} ${ampm}`;
  document.getElementById('time').innerHTML = time;
  document.getElementById('date').innerHTML = `${date.toLocaleString(
    'default',
    { month: 'short', day: 'numeric', year: 'numeric' }
  )}`;
  setTimeout(updateClock, 1000);
}

updateClock();

//////////////////////////////////////////////////////////////////////////////////
// OpenWeather API

const weatherContainer = document.getElementById('box-3');
const round = num => Math.round(num);
const day = date =>
  new Date(date).toLocaleString('default', { weekday: 'long' });

//////////////////////////////////////////////////////////////////////////////////

const getWeatherData = async function () {
  const APIKEY = 'fe0aa0dd338479d46a2a1f01b298204a';
  const lat = '13.205110';
  const lon = '80.177361';

  try {
    // 1) Load Weather Data
    const res = await fetch(
      `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=hourly,minutely&appid=${APIKEY}&units=imperial`
    );

    const data = await res.json();

    if (!res.ok) throw new Error(`${data.message} (${res.status})`);

    // console.log(data);
    // console.log(new Date(data.current.dt * 1000));
    // console.log('-------------------------------------------');
    // console.log(new Date(data.daily[0].dt * 1000));
    // data.daily.forEach(item => console.log(new Date(item.dt * 1000)));
    // console.log('-------------------------------------------');

    // 2) Render Data
    const markup = `
      <ul>
        <li>Today (${day(data.current.dt * 1000)})</li>
        <li>${weatherIcon(
          data.current.weather[0].main,
          data.current.dt,
          data.current.sunset
        )} ${data.current.weather[0].description}</li>
        <li>Temp: ${round(data.current.temp * 10) / 10} ॰F</li>
        <li>High: ${round(data.daily[0].temp.max * 10) / 10} ॰F</li>
        <li>Low: ${round(data.daily[0].temp.min * 10) / 10} ॰F</li>
      </ul>

      <ul>
        <li>Tomorrow (${day(data.daily[1].dt * 1000)})</li>
        <li>${weatherIcon(
          data.daily[1].weather[0].main,
          data.daily[1].dt,
          data.daily[1].sunset
        )} ${data.daily[1].weather[0].description}</li>
        <li>Temp: ${round(data.daily[1].temp.day)} ॰F</li>
        <li>High: ${round(data.daily[1].temp.max * 10) / 10} ॰F</li>
        <li>Low: ${round(data.daily[1].temp.min * 10) / 10} ॰F</li>
      </ul>
    `;
    weatherContainer.innerHTML = markup;
    setTimeout(getWeatherData, 7200000);
  } catch (err) {
    console.log(`${err} 👎`);
  }
};

getWeatherData();

//////////////////////////////////////////////////////////////////////////////////
// Weather Icon SVGs Function

const weatherIcon = function (main, time, sunset) {
  const curTime = new Date(time * 1000).getHours();
  // console.log(curTime);
  const dark = new Date(sunset * 1000).getHours();
  // console.log(dark);

  if (main === 'Thunderstorm') {
    return `<svg
    aria-hidden="true"
    focusable="false"
    data-prefix="fas"
    data-icon="bolt"
    class="svg-inline--fa fa-bolt"
    role="img"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 384 512"
  >
    <path
      fill="currentColor"
      d="M373.1 280.1l-255.1 223.1C111.1 509.3 103.5 512 96 512c-6.593 0-13.19-2.016-18.81-6.109c-12.09-8.781-16.5-24.76-10.59-38.5L143.5 288L32.01 288c-13.34 0-25.28-8.266-29.97-20.75c-4.687-12.47-1.125-26.55 8.906-35.33l255.1-223.1c11.25-9.89 27.81-10.58 39.87-1.799c12.09 8.781 16.5 24.76 10.59 38.5l-76.88 179.4l111.5-.0076c13.34 0 25.28 8.266 29.97 20.75C386.6 257.2 383.1 271.3 373.1 280.1z"
    ></path>
  </svg>`;
  } else if (main === 'Drizzle' && curTime <= dark) {
    return `<svg
    aria-hidden="true"
    focusable="false"
    data-prefix="fas"
    data-icon="cloud-sun-rain"
    class="svg-inline--fa fa-cloud-sun-rain"
    role="img"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 640 512"
  >
    <path
      fill="currentColor"
      d="M255.7 139.1C244.8 125.5 227.6 116 208 116c-33.14 0-60 26.86-60 59.1c0 25.56 16.06 47.24 38.58 55.88C197.2 219.3 210.5 208.9 225.9 201.1C229.1 178.5 240.6 157.3 255.7 139.1zM120 175.1c0-48.6 39.4-87.1 88-87.1c27.8 0 52.29 13.14 68.42 33.27c21.24-15.67 47.22-25.3 75.58-25.3c.0098 0-.0098 0 0 0L300.4 83.58L286.9 8.637C285.9 3.346 281.3 .0003 276.5 .0003c-2.027 0-4.096 .5928-5.955 1.881l-62.57 43.42L145.4 1.882C143.6 .5925 141.5-.0003 139.5-.0003c-4.818 0-9.399 3.346-10.35 8.636l-13.54 74.95L40.64 97.13c-5.289 .9556-8.637 5.538-8.637 10.36c0 2.026 .5921 4.094 1.881 5.951l43.41 62.57L33.88 238.6C32.59 240.4 32 242.5 32 244.5c0 4.817 3.347 9.398 8.636 10.35l74.95 13.54l13.54 74.95c.9555 5.289 5.537 8.636 10.35 8.636c2.027 0 4.096-.5927 5.954-1.882l19.47-13.51c-3.16-10.34-4.934-21.28-4.934-32.64c0-17.17 4.031-33.57 11.14-48.32C141 241.7 120 211.4 120 175.1zM542.5 225.5c-6.875-37.25-39.25-65.5-78.51-65.5c-12.25 0-23.88 3-34.25 8c-17.5-24.13-45.63-40-77.76-40c-53 0-96.01 43-96.01 96c0 .5 .25 1.125 .25 1.625C219.6 232.1 191.1 265.2 191.1 303.1c0 44.25 35.75 80 80.01 80h256C572.2 383.1 608 348.2 608 303.1C608 264.7 579.7 232.2 542.5 225.5zM552 415.1c-7.753 0-15.35 3.752-19.97 10.69l-32 48c-2.731 4.093-4.037 8.719-4.037 13.29C496 501.4 506.9 512 520 512c7.75 0 15.36-3.75 19.98-10.69l32-48c2.731-4.093 4.037-8.719 4.037-13.29C576 426.6 565.1 415.1 552 415.1zM456 415.1c-7.751 0-15.34 3.752-19.98 10.69l-32 48c-2.731 4.093-4.037 8.719-4.037 13.29C400 501.4 410.9 512 423.1 512c7.75 0 15.36-3.75 19.98-10.69l32-48c2.731-4.093 4.037-8.719 4.037-13.29C480 426.6 469.1 415.1 456 415.1zM360 415.1c-7.753 0-15.34 3.752-19.97 10.69l-32 48c-2.731 4.093-4.037 8.719-4.037 13.29C304 501.4 314.9 512 327.1 512c7.75 0 15.36-3.75 19.99-10.69l32-48c2.731-4.093 4.037-8.719 4.037-13.29C384 426.6 373.1 415.1 360 415.1zM264 415.1c-7.756 0-15.35 3.752-19.97 10.69l-32 48c-2.731 4.093-4.037 8.719-4.037 13.29C208 501.4 218.9 512 231.1 512c7.75 0 15.36-3.75 19.98-10.69l32-48c2.731-4.093 4.037-8.719 4.037-13.29C288 426.6 277.1 415.1 264 415.1z"
    ></path>
  </svg>`;
  } else if (main === 'Drizzle' && curTime > dark) {
    return `<svg
    aria-hidden="true"
    focusable="false"
    data-prefix="fas"
    data-icon="cloud-moon-rain"
    class="svg-inline--fa fa-cloud-moon-rain"
    role="img"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 576 512"
  >
    <path
      fill="currentColor"
      d="M350.5 225.5c-6.876-37.25-39.25-65.5-78.51-65.5c-12.25 0-23.88 2.1-34.25 7.1C220.3 143.9 192.1 128 160 128c-53.01 0-96.01 42.1-96.01 95.1c0 .5 .25 1.125 .25 1.625C27.63 232.9 0 265.3 0 304c0 44.25 35.75 79.1 80.01 79.1h256c44.25 0 80.01-35.75 80.01-79.1C416 264.8 387.8 232.3 350.5 225.5zM567.9 223.8C497.6 237.1 432.9 183.5 432.9 113c0-40.63 21.88-78 57.5-98.13c5.501-3.125 4.077-11.37-2.173-12.5C479.6 .7538 470.8 0 461.8 0c-77.88 0-141.1 61.25-144.4 137.9c26.75 11.88 48.26 33.88 58.88 61.75c37.13 14.25 64.01 47.38 70.26 86.75c5.126 .5 10.05 1.522 15.3 1.522c44.63 0 85.46-20.15 112.5-53.27C578.6 229.8 574.2 222.6 567.9 223.8zM340.1 426.7l-32 48c-7.345 11.03-4.376 25.94 6.657 33.28C318.8 510.7 323.4 512 327.1 512c7.751 0 15.38-3.75 20-10.69l32-48c7.345-11.03 4.376-25.94-6.657-33.28C362.3 412.7 347.4 415.7 340.1 426.7zM244 426.7l-32 48c-7.345 11.03-4.376 25.94 6.657 33.28C222.8 510.7 227.4 512 231.1 512c7.751 0 15.38-3.75 20-10.69l32-48c7.345-11.03 4.376-25.94-6.657-33.28C266.3 412.7 251.4 415.7 244 426.7zM148 426.7l-32 48c-7.345 11.03-4.376 25.94 6.657 33.28C126.8 510.7 131.4 512 135.1 512c7.751 0 15.38-3.75 20-10.69l32-48c7.345-11.03 4.376-25.94-6.657-33.28C170.3 412.7 155.4 415.7 148 426.7zM52.03 426.7l-32 48c-7.345 11.03-4.376 25.94 6.657 33.28C30.78 510.7 35.41 512 39.97 512c7.751 0 15.38-3.75 20-10.69l32-48c7.345-11.03 4.376-25.94-6.657-33.28C74.25 412.7 59.41 415.7 52.03 426.7z"
    ></path>
  </svg>`;
  } else if (main === 'Rain' && curTime <= dark) {
    return `<svg
    aria-hidden="true"
    focusable="false"
    data-prefix="fas"
    data-icon="cloud-sun-rain"
    class="svg-inline--fa fa-cloud-sun-rain"
    role="img"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 640 512"
  >
    <path
      fill="currentColor"
      d="M255.7 139.1C244.8 125.5 227.6 116 208 116c-33.14 0-60 26.86-60 59.1c0 25.56 16.06 47.24 38.58 55.88C197.2 219.3 210.5 208.9 225.9 201.1C229.1 178.5 240.6 157.3 255.7 139.1zM120 175.1c0-48.6 39.4-87.1 88-87.1c27.8 0 52.29 13.14 68.42 33.27c21.24-15.67 47.22-25.3 75.58-25.3c.0098 0-.0098 0 0 0L300.4 83.58L286.9 8.637C285.9 3.346 281.3 .0003 276.5 .0003c-2.027 0-4.096 .5928-5.955 1.881l-62.57 43.42L145.4 1.882C143.6 .5925 141.5-.0003 139.5-.0003c-4.818 0-9.399 3.346-10.35 8.636l-13.54 74.95L40.64 97.13c-5.289 .9556-8.637 5.538-8.637 10.36c0 2.026 .5921 4.094 1.881 5.951l43.41 62.57L33.88 238.6C32.59 240.4 32 242.5 32 244.5c0 4.817 3.347 9.398 8.636 10.35l74.95 13.54l13.54 74.95c.9555 5.289 5.537 8.636 10.35 8.636c2.027 0 4.096-.5927 5.954-1.882l19.47-13.51c-3.16-10.34-4.934-21.28-4.934-32.64c0-17.17 4.031-33.57 11.14-48.32C141 241.7 120 211.4 120 175.1zM542.5 225.5c-6.875-37.25-39.25-65.5-78.51-65.5c-12.25 0-23.88 3-34.25 8c-17.5-24.13-45.63-40-77.76-40c-53 0-96.01 43-96.01 96c0 .5 .25 1.125 .25 1.625C219.6 232.1 191.1 265.2 191.1 303.1c0 44.25 35.75 80 80.01 80h256C572.2 383.1 608 348.2 608 303.1C608 264.7 579.7 232.2 542.5 225.5zM552 415.1c-7.753 0-15.35 3.752-19.97 10.69l-32 48c-2.731 4.093-4.037 8.719-4.037 13.29C496 501.4 506.9 512 520 512c7.75 0 15.36-3.75 19.98-10.69l32-48c2.731-4.093 4.037-8.719 4.037-13.29C576 426.6 565.1 415.1 552 415.1zM456 415.1c-7.751 0-15.34 3.752-19.98 10.69l-32 48c-2.731 4.093-4.037 8.719-4.037 13.29C400 501.4 410.9 512 423.1 512c7.75 0 15.36-3.75 19.98-10.69l32-48c2.731-4.093 4.037-8.719 4.037-13.29C480 426.6 469.1 415.1 456 415.1zM360 415.1c-7.753 0-15.34 3.752-19.97 10.69l-32 48c-2.731 4.093-4.037 8.719-4.037 13.29C304 501.4 314.9 512 327.1 512c7.75 0 15.36-3.75 19.99-10.69l32-48c2.731-4.093 4.037-8.719 4.037-13.29C384 426.6 373.1 415.1 360 415.1zM264 415.1c-7.756 0-15.35 3.752-19.97 10.69l-32 48c-2.731 4.093-4.037 8.719-4.037 13.29C208 501.4 218.9 512 231.1 512c7.75 0 15.36-3.75 19.98-10.69l32-48c2.731-4.093 4.037-8.719 4.037-13.29C288 426.6 277.1 415.1 264 415.1z"
    ></path>
  </svg>`;
  } else if (main === 'Rain' && curTime > dark) {
    return `<svg
    aria-hidden="true"
    focusable="false"
    data-prefix="fas"
    data-icon="cloud-moon-rain"
    class="svg-inline--fa fa-cloud-moon-rain"
    role="img"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 576 512"
  >
    <path
      fill="currentColor"
      d="M350.5 225.5c-6.876-37.25-39.25-65.5-78.51-65.5c-12.25 0-23.88 2.1-34.25 7.1C220.3 143.9 192.1 128 160 128c-53.01 0-96.01 42.1-96.01 95.1c0 .5 .25 1.125 .25 1.625C27.63 232.9 0 265.3 0 304c0 44.25 35.75 79.1 80.01 79.1h256c44.25 0 80.01-35.75 80.01-79.1C416 264.8 387.8 232.3 350.5 225.5zM567.9 223.8C497.6 237.1 432.9 183.5 432.9 113c0-40.63 21.88-78 57.5-98.13c5.501-3.125 4.077-11.37-2.173-12.5C479.6 .7538 470.8 0 461.8 0c-77.88 0-141.1 61.25-144.4 137.9c26.75 11.88 48.26 33.88 58.88 61.75c37.13 14.25 64.01 47.38 70.26 86.75c5.126 .5 10.05 1.522 15.3 1.522c44.63 0 85.46-20.15 112.5-53.27C578.6 229.8 574.2 222.6 567.9 223.8zM340.1 426.7l-32 48c-7.345 11.03-4.376 25.94 6.657 33.28C318.8 510.7 323.4 512 327.1 512c7.751 0 15.38-3.75 20-10.69l32-48c7.345-11.03 4.376-25.94-6.657-33.28C362.3 412.7 347.4 415.7 340.1 426.7zM244 426.7l-32 48c-7.345 11.03-4.376 25.94 6.657 33.28C222.8 510.7 227.4 512 231.1 512c7.751 0 15.38-3.75 20-10.69l32-48c7.345-11.03 4.376-25.94-6.657-33.28C266.3 412.7 251.4 415.7 244 426.7zM148 426.7l-32 48c-7.345 11.03-4.376 25.94 6.657 33.28C126.8 510.7 131.4 512 135.1 512c7.751 0 15.38-3.75 20-10.69l32-48c7.345-11.03 4.376-25.94-6.657-33.28C170.3 412.7 155.4 415.7 148 426.7zM52.03 426.7l-32 48c-7.345 11.03-4.376 25.94 6.657 33.28C30.78 510.7 35.41 512 39.97 512c7.751 0 15.38-3.75 20-10.69l32-48c7.345-11.03 4.376-25.94-6.657-33.28C74.25 412.7 59.41 415.7 52.03 426.7z"
    ></path>
  </svg>`;
  } else if (main === 'Snow') {
    return `<svg
    aria-hidden="true"
    focusable="false"
    data-prefix="fas"
    data-icon="snowflake"
    class="svg-inline--fa fa-snowflake"
    role="img"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 512 512"
  >
    <path
      fill="currentColor"
      d="M475.6 384.1C469.7 394.3 458.9 400 447.9 400c-5.488 0-11.04-1.406-16.13-4.375l-25.09-14.64l5.379 20.29c3.393 12.81-4.256 25.97-17.08 29.34c-2.064 .5625-4.129 .8125-6.164 .8125c-10.63 0-20.36-7.094-23.21-17.84l-17.74-66.92L288 311.7l.0002 70.5l48.38 48.88c9.338 9.438 9.244 24.62-.1875 33.94C331.5 469.7 325.4 472 319.3 472c-6.193 0-12.39-2.375-17.08-7.125l-14.22-14.37L288 480c0 17.69-14.34 32-32.03 32s-32.03-14.31-32.03-32l-.0002-29.5l-14.22 14.37c-9.322 9.438-24.53 9.5-33.97 .1875c-9.432-9.312-9.525-24.5-.1875-33.94l48.38-48.88L223.1 311.7l-59.87 34.93l-17.74 66.92c-2.848 10.75-12.58 17.84-23.21 17.84c-2.035 0-4.1-.25-6.164-.8125c-12.82-3.375-20.47-16.53-17.08-29.34l5.379-20.29l-25.09 14.64C75.11 398.6 69.56 400 64.07 400c-11.01 0-21.74-5.688-27.69-15.88c-8.932-15.25-3.785-34.84 11.5-43.75l25.96-15.15l-20.33-5.508C40.7 316.3 33.15 303.1 36.62 290.3S53.23 270 66.09 273.4L132 291.3L192.5 256L132 220.7L66.09 238.6c-2.111 .5625-4.225 .8438-6.305 .8438c-10.57 0-20.27-7.031-23.16-17.72C33.15 208.9 40.7 195.8 53.51 192.3l20.33-5.508L47.88 171.6c-15.28-8.906-20.43-28.5-11.5-43.75c8.885-15.28 28.5-20.44 43.81-11.5l25.09 14.64L99.9 110.7C96.51 97.91 104.2 84.75 116.1 81.38C129.9 77.91 142.1 85.63 146.4 98.41l17.74 66.92L223.1 200.3l-.0002-70.5L175.6 80.88C166.3 71.44 166.3 56.25 175.8 46.94C185.2 37.59 200.4 37.72 209.8 47.13l14.22 14.37L223.1 32c0-17.69 14.34-32 32.03-32s32.03 14.31 32.03 32l.0002 29.5l14.22-14.37c9.307-9.406 24.51-9.531 33.97-.1875c9.432 9.312 9.525 24.5 .1875 33.94l-48.38 48.88L288 200.3l59.87-34.93l17.74-66.92c3.395-12.78 16.56-20.5 29.38-17.03c12.82 3.375 20.47 16.53 17.08 29.34l-5.379 20.29l25.09-14.64c15.28-8.906 34.91-3.75 43.81 11.5c8.932 15.25 3.785 34.84-11.5 43.75l-25.96 15.15l20.33 5.508c12.81 3.469 20.37 16.66 16.89 29.44c-2.895 10.69-12.59 17.72-23.16 17.72c-2.08 0-4.193-.2813-6.305-.8438L379.1 220.7L319.5 256l60.46 35.28l65.95-17.87C458.8 270 471.9 277.5 475.4 290.3c3.473 12.78-4.082 25.97-16.89 29.44l-20.33 5.508l25.96 15.15C479.4 349.3 484.5 368.9 475.6 384.1z"
    ></path>
  </svg>`;
  } else if (
    main === 'Mist' ||
    main === 'Smoke' ||
    main === 'Haze' ||
    main === 'Dust' ||
    main === 'Fog' ||
    main === 'Sand' ||
    main === 'Dust' ||
    main === 'Ash' ||
    main === 'Squall' ||
    main === 'Tornado'
  ) {
    return `<svg
    aria-hidden="true"
    focusable="false"
    data-prefix="fas"
    data-icon="smog"
    class="svg-inline--fa fa-smog"
    role="img"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 640 512"
  >
    <path
      fill="currentColor"
      d="M144 288h156.1C322.6 307.8 351.8 320 384 320s61.25-12.25 83.88-32H528C589.9 288 640 237.9 640 176s-50.13-112-112-112c-18 0-34.75 4.625-49.75 12.12C453.1 30.1 406.8 0 352 0c-41 0-77.75 17.25-104 44.75C221.8 17.25 185 0 144 0c-79.5 0-144 64.5-144 144S64.5 288 144 288zM136 464H23.1C10.8 464 0 474.8 0 487.1S10.8 512 23.1 512H136C149.2 512 160 501.2 160 488S149.2 464 136 464zM616 368h-528C74.8 368 64 378.8 64 391.1S74.8 416 87.1 416h528c13.2 0 24-10.8 24-23.1S629.2 368 616 368zM552 464H231.1C218.8 464 208 474.8 208 487.1S218.8 512 231.1 512H552c13.2 0 24-10.8 24-23.1S565.2 464 552 464z"
    ></path>
  </svg>`;
  } else if (main === 'Clear' && curTime <= dark) {
    return `<svg
    aria-hidden="true"
    focusable="false"
    data-prefix="fas"
    data-icon="sun"
    class="svg-inline--fa fa-sun"
    role="img"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 512 512"
  >
    <path
      fill="currentColor"
      d="M256 159.1c-53.02 0-95.1 42.98-95.1 95.1S202.1 351.1 256 351.1s95.1-42.98 95.1-95.1S309 159.1 256 159.1zM509.3 347L446.1 255.1l63.15-91.01c6.332-9.125 1.104-21.74-9.826-23.72l-109-19.7l-19.7-109c-1.975-10.93-14.59-16.16-23.72-9.824L256 65.89L164.1 2.736c-9.125-6.332-21.74-1.107-23.72 9.824L121.6 121.6L12.56 141.3C1.633 143.2-3.596 155.9 2.736 164.1L65.89 256l-63.15 91.01c-6.332 9.125-1.105 21.74 9.824 23.72l109 19.7l19.7 109c1.975 10.93 14.59 16.16 23.72 9.824L256 446.1l91.01 63.15c9.127 6.334 21.75 1.107 23.72-9.822l19.7-109l109-19.7C510.4 368.8 515.6 356.1 509.3 347zM256 383.1c-70.69 0-127.1-57.31-127.1-127.1c0-70.69 57.31-127.1 127.1-127.1s127.1 57.3 127.1 127.1C383.1 326.7 326.7 383.1 256 383.1z"
    ></path>
  </svg>`;
  } else if (main === 'Clear' && curTime > dark) {
    return `<svg
    aria-hidden="true"
    focusable="false"
    data-prefix="fas"
    data-icon="moon"
    class="svg-inline--fa fa-moon"
    role="img"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 512 512"
  >
    <path
      fill="currentColor"
      d="M32 256c0-123.8 100.3-224 223.8-224c11.36 0 29.7 1.668 40.9 3.746c9.616 1.777 11.75 14.63 3.279 19.44C245 86.5 211.2 144.6 211.2 207.8c0 109.7 99.71 193 208.3 172.3c9.561-1.805 16.28 9.324 10.11 16.95C387.9 448.6 324.8 480 255.8 480C132.1 480 32 379.6 32 256z"
    ></path>
  </svg>`;
  } else if (main === 'Clouds' && curTime <= dark) {
    return `<svg
    aria-hidden="true"
    focusable="false"
    data-prefix="fas"
    data-icon="cloud-sun"
    class="svg-inline--fa fa-cloud-sun"
    role="img"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 640 512"
  >
    <path
      fill="currentColor"
      d="M96 208c0-61.86 50.14-111.1 111.1-111.1c52.65 0 96.5 36.45 108.5 85.42C334.7 173.1 354.7 168 375.1 168c4.607 0 9.152 .3809 13.68 .8203l24.13-34.76c5.145-7.414 .8965-17.67-7.984-19.27L317.2 98.78L301.2 10.21C299.6 1.325 289.4-2.919 281.9 2.226L208 53.54L134.1 2.225C126.6-2.92 116.4 1.326 114.8 10.21L98.78 98.78L10.21 114.8C1.326 116.4-2.922 126.7 2.223 134.1l51.3 73.94L2.224 281.9c-5.145 7.414-.8975 17.67 7.983 19.27L98.78 317.2l16.01 88.58c1.604 8.881 11.86 13.13 19.27 7.982l10.71-7.432c2.725-35.15 19.85-66.51 45.83-88.1C137.1 309.8 96 263.9 96 208zM128 208c0 44.18 35.82 80 80 80c9.729 0 18.93-1.996 27.56-5.176c7.002-33.65 25.53-62.85 51.57-83.44C282.8 159.3 249.2 128 208 128C163.8 128 128 163.8 128 208zM575.2 325.6c.125-2 .7453-3.744 .7453-5.619c0-35.38-28.75-64-63.1-64c-12.62 0-24.25 3.749-34.13 9.999c-17.62-38.88-56.5-65.1-101.9-65.1c-61.75 0-112 50.12-112 111.1c0 3 .7522 5.743 .8772 8.618c-49.63 3.75-88.88 44.74-88.88 95.37C175.1 469 218.1 512 271.1 512h272c53 0 96-42.99 96-95.99C639.1 373.9 612.7 338.6 575.2 325.6z"
    ></path>
  </svg>`;
  } else if (main === 'Clouds' && curTime > dark) {
    return `<svg
    aria-hidden="true"
    focusable="false"
    data-prefix="fas"
    data-icon="cloud-moon"
    class="svg-inline--fa fa-cloud-moon"
    role="img"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 576 512"
  >
    <path
      fill="currentColor"
      d="M342.7 352.7c5.75-9.625 9.25-20.75 9.25-32.75c0-35.25-28.75-64-63.1-64c-17.25 0-32.75 6.875-44.25 17.87C227.4 244.2 196.2 223.1 159.1 223.1c-53 0-96 43.06-96 96.06c0 2 .5029 3.687 .6279 5.687c-37.5 13-64.62 48.38-64.62 90.25C-.0048 468.1 42.99 512 95.99 512h239.1c44.25 0 79.1-35.75 79.1-80C415.1 390.1 383.7 356.2 342.7 352.7zM565.2 298.4c-93 17.75-178.5-53.62-178.5-147.6c0-54.25 28.1-104 76.12-130.9c7.375-4.125 5.375-15.12-2.75-16.63C448.4 1.125 436.7 0 424.1 0c-105.9 0-191.9 85.88-191.9 192c0 8.5 .625 16.75 1.75 25c5.875 4.25 11.62 8.875 16.75 14.25C262.1 226.5 275.2 224 287.1 224c52.88 0 95.1 43.13 95.1 96c0 3.625-.25 7.25-.625 10.75c23.62 10.75 42.37 29.5 53.5 52.5c54.38-3.375 103.7-29.25 137.1-70.37C579.2 306.4 573.5 296.8 565.2 298.4z"
    ></path>
  </svg>`;
  }
};
