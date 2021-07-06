'use strict';

const btn = document.querySelector('.btn-country');
const countriesContainer = document.querySelector('.countries');

///////////////////////////////////////
const handleResponse = function () {
    const [respData] = JSON.parse(this.responseText);
    displayResponse(respData);
    const neighbours = respData.borders || [];
    let count = 0;
    for (const neighbour of neighbours) {
        if (count++ === 2) {
            break;
        }
        const request = new XMLHttpRequest();
        request.open('GET', `https://restcountries.eu/rest/v2/alpha/${neighbour}`);
        request.send();
        request.addEventListener('load', function () {
            displayResponse(JSON.parse(this.responseText), 'neighbour');
        });
    }
}

const displayResponse = function (respData, className = '') {
    const html =
        `<article class="country ${className}">
                <img class="country__img" src="${respData.flag}" />
                <div class="country__data">
                <h3 class="country__name">${respData.name}</h3>
                <h4 class="country__region">${respData.region}</h4>
                <p class="country__row"><span>👫</span>${(+respData.population/1000000).toFixed(1)} people</p>
                <p class="country__row"><span>🗣️</span>${respData.languages[0].name}</p>
                <p class="country__row"><span>💰</span>${respData.currencies[0].name}</p>
                </div>
            </article> `;
    countriesContainer.insertAdjacentHTML('beforeend', html);
    countriesContainer.style.opacity = 1;
}

const getCountryData = function (countryName) {
    const request = new XMLHttpRequest();
    request.open('GET', `https://restcountries.eu/rest/v2/name/${countryName}`);
    request.send();
    request.addEventListener('load', handleResponse);
}
    
btn.addEventListener('click',()=>{
    countriesContainer.innerHTML='';
    const input = ['bharat'];
    input.forEach(country => getCountryData(country));
});
