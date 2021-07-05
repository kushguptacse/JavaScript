'use strict';

const btn = document.querySelector('.btn-country');
const countriesContainer = document.querySelector('.countries');

///////////////////////////////////////
const handleResponse = function (resp) {
    const [respData] = resp;
    displayResponse(respData);
    const neighbour = respData.borders[0];
    return getJson(`https://restcountries.eu/rest/v2/alpha/${neighbour}`,`neighbour not found`);
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
}

const getCountryData = function (countryName) {
    getJson(`https://restcountries.eu/rest/v2/name/${countryName}`,`country ${countryName} not found`).
    then(handleResponse).
    then(responseData => displayResponse(responseData, 'neighbour')).
    catch(err=>handleError(err.message)).
    finally(()=> countriesContainer.style.opacity=1);
}

const getJson = function (url,msg='something went wrong') {
    return fetch(url).then(resp => {
        if (!resp.ok) {
            throw new Error(msg);
        }
        return resp.json();
    });
}

const handleError = function(msg) {
    countriesContainer.insertAdjacentText('beforeend',msg);
}

btn.addEventListener('click',()=>{
    countriesContainer.innerHTML='';
    const input = ['bharat'];
    input.forEach(country => getCountryData(country));
});