'use strict';

const btn2 = document.querySelector('.btn2');

///////////////////////////////////////
const whereAmI = function (lat, lng) {
    const url = `https://geocode.xyz/${lat},${lng}?geoit=json`;
    getJson(url, `unable to load city with [${lat},${lng}] `).
    then(data => getCountryData(data.country));
}

btn2.addEventListener('click', () => {
    countriesContainer.innerHTML = '';
    //getting position via promise simplified way
    const getPosition = () => new Promise((res, rej) => navigator.geolocation.getCurrentPosition(res,rej));
    getPosition().then(res=>whereAmI(res.coords.latitude,res.coords.longitude)).
    catch(err => handleError(err.message)).
    finally(() => countriesContainer.style.opacity = 1);
});