'use strict';

///////////////////////////////////////
const whereAmI = function(lat,lng) {
    const url = `https://geocode.xyz/${lat},${lng}?geoit=json`;
    getJson(url,`unable to load city with [${lat},${lng}] `).
    then(data=>getCountryData(data.country)).
    catch(err=>handleError(err.message)).
    finally(()=> countriesContainer.style.opacity=1);
}

btn.addEventListener('click',()=>{
    countriesContainer.innerHTML='';
    whereAmI(52.508,13.381);
});