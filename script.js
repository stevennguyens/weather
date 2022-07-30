async function getWeather(location) {
    const response = await fetch(`http://api.openweathermap.org/data/2.5/weather?q=${location}&units=imperial&APPID=577dfe24fcbd569ed7b3338ce374dd4e`, {
        mode: 'cors'
      });
    const weatherResponse = await response.json(); 
    return weatherResponse;
}

async function getWeatherCoord(lat, lon) {
    const response = await fetch(`http://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=imperial&APPID=577dfe24fcbd569ed7b3338ce374dd4e`);
    const weatherResponse = await response.json();
    return weatherResponse;
}

let timeout;
function getWeatherData(location) {
    const weatherData = getWeather(location);

    weatherData.then(response => {
        const timezone = response.timezone;

        dateToString(timezone);
        startTime(timezone);
    
        const locationName = response.name;
    
        const locationTitle = document.querySelector('.location .name');
        locationTitle.textContent = locationName;
    
        const temperature = document.querySelector('.temperature');
        temperature.textContent = `${round(response.main.temp)}°`;
    
        const description = document.querySelector('.description');
        description.textContent = capitalizeFirstLetter(response.weather[0].description);
    
        const wind = document.querySelector('.wind p');
        wind.textContent = `${response.wind.speed} mph`;
    
        const humidity = document.querySelector('.humidity p');
        humidity.textContent = `${round(response.main.humidity)}%`;
    
        const highTemp = document.querySelector('.high p');
        highTemp.textContent = `${round(response.main.temp_max)}°`
    
        const lowTemp = document.querySelector('.low p');
        lowTemp.textContent = `${round(response.main.temp_min)}°`;

        const tempBtn = document.querySelector('.temp-btn');
        tempBtn.addEventListener('click', () => changeTemp(tempBtn, temperature));
    })
    
    function dateToString(timezone) {
        let currentDate = getTimeTimezone(timezone).toString().split(' ');
        let dateString = `${currentDate[0]} ${currentDate[1]} ${currentDate[2]}, ${currentDate[3]}`;
        const date = document.querySelector('.date');
        date.textContent = dateString;
    }

    function startTime(timezone) {
        clearTimeout(timeout);
        let currentDate = getTimeTimezone(timezone);
        let hours = currentDate.getHours();
        let minutes = currentDate.getMinutes();
        let seconds = currentDate.getSeconds();
        let meridiem = '';
    
        if (hours >= 12) {
            meridiem = 'PM'
            hours = hours % 12;
        } else {
            meridiem = 'AM'
        }
        minutes = checkTime(minutes);
        seconds = checkTime(seconds);
    
        const time = document.querySelector('.time');
        time.innerHTML = `${hours}:${minutes}:${seconds} ${meridiem}`;
        timeout = setTimeout(startTime, 1000, timezone);
    }
    
    function checkTime(time) {
        if (time < 10) {
            time = `0${time}`;
        }
        return time;
    }

    function changeTemp(tempBtn, temp) {
        let oldTemp = temp.textContent.slice(0, -1);
        let newTemp;
        if (tempBtn.textContent[0] === 'C') {
            tempBtn.textContent = 'F' + tempBtn.textContent[1];
            newTemp = (5/9) * (oldTemp - 32);
            temp.textContent = `${round(newTemp)}°`;
        } else {
            tempBtn.textContent = 'C' + tempBtn.textContent[1];
            newTemp = ((9/5) * oldTemp) + 32;
            temp.textContent = `${round(newTemp)}°`;
        }
    };
    return weatherData;
}

async function deleteFetch(location) {
    fetch(`http://api.openweathermap.org/data/2.5/weather?q=${location}&units=imperial&APPID=577dfe24fcbd569ed7b3338ce374dd4e`, {
        method: 'DELETE',
        mode: 'cors'
    });
}

function round(num) {
    return Math.round(num);
}

function capitalizeFirstLetter(word) {
    let wordArr = word.split(' ');
    for (let i = 0; i < wordArr.length; i++) {
        wordArr[i] = wordArr[i][0].toUpperCase() + wordArr[i].substr(1);
    }
    return wordArr.join(' ');
}


const search = document.getElementById('search');

let controller;
let executed = false;


if (!executed) {
    const defaultWeather = getWeatherData('Los Angeles');
    executed = true;
}

// -25200
search.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        e.preventDefault();
        
        getWeatherData(search.value);
        
        search.value = '';
    }
})

// function getTime(dt) {
//     console.log(new Date(dt));
// }

function getTimeTimezone(timezone) {
    const date = new Date();
    const year = date.getUTCFullYear();
    const month = date.getUTCMonth();
    const day = date.getUTCDate();
    const hours = date.getUTCHours();
    const minutes = date.getUTCMinutes();
    const seconds = date.getUTCSeconds();

    const UTCdate = new Date(year, month, day, hours, minutes, seconds);
    const UTCseconds = UTCdate.getTime() / 1000;
    const currDate = new Date((UTCseconds + timezone) * 1000);
    
    return currDate;
}

