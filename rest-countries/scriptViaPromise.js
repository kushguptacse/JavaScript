'use strict';

const btn = document.querySelector('.btn-country');
const countriesContainer = document.querySelector('.countries');

///////////////////////////////////////
const handleResponse = function (resp) {
    const [respData] = resp;
    displayResponse(respData);
    const neighbour = respData.borders[0];
    return fetch(`https://restcountries.eu/rest/v2/alpha/${neighbour}`);
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
    fetch(`https://restcountries.eu/rest/v2/name/${countryName}`).
    then(resp => resp.json()).
    then(handleResponse).
    then(resp1 => resp1.json()).
    then(responseData => displayResponse(responseData, 'neighbour'));
}

btn.addEventListener('click',()=>{
    const input = ['japan'];
    input.forEach(country => getCountryData(country));
});