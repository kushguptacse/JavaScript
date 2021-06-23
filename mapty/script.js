'use strict';

// prettier-ignore
const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

const form = document.querySelector('.form');
const containerWorkouts = document.querySelector('.workouts');
const inputType = document.querySelector('.form__input--type');
const inputDistance = document.querySelector('.form__input--distance');
const inputDuration = document.querySelector('.form__input--duration');
const inputCadence = document.querySelector('.form__input--cadence');
const inputElevation = document.querySelector('.form__input--elevation');
class Workout {
    _date = new Date();
    _id = (Date.now()+'').slice(-10);
    constructor(coords, distance, duration) {
        this.coords = coords;
        this.distance = distance;
        this.duration = duration;
    }
    _setDescription() {
        this._description = `${this._name[0].toUpperCase()}${this._name.slice(1)} on ${new Intl.DateTimeFormat('en-IN',{month:'long',day:'numeric'}).format(this._date)}`;
    }
}

class Running extends Workout {
    _name = 'running';
    constructor(coords, distance, duration, cadence) {
        super(coords, distance, duration);
        this.cadence = cadence;
        this.calcPace();
        this._setDescription();
    }

    calcPace() {
        this.pace = this.duration / this.distance;
        return this.pace;
    }
}

class Cycling extends Workout {
    _name = 'cycling';
    constructor(coords, distance, duration, elevationGain) {
        super(coords, distance, duration);
        this.elevationGain = elevationGain;
        this.calcSpeed();
        this._setDescription();
    }

    calcSpeed() {
        this.speed = this.distance / (this.duration / 60);
        return this.speed;
    }
}

class App {
    #map;
    #coords;
    #workouts;

    constructor() {
        inputType.addEventListener('change', this._toggleElevationField.bind(this));
        form.addEventListener('submit', this._newWorkout.bind(this));
        containerWorkouts.addEventListener('click', this._moveToMarker.bind(this));
        const workouts = this._getWorkOutsFromLocalStorage();
        this.#workouts = workouts ? workouts : [];
        this._getPosition();
    }

    _getPosition() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(this._loadMap.bind(this), () => alert('could not get the location'));
        }
    }

    _loadMap(pos) {
        this.#coords = [pos.coords.latitude, pos.coords.longitude];
        this.#map = L.map('map').setView(this.#coords, 14);
        L.tileLayer('https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(this.#map);
        const mapClick = function (mapEvent) {
            this.#coords = [mapEvent.latlng.lat, mapEvent.latlng.lng];
            this._showForm();
        }
        this.#map.on('click', mapClick.bind(this));
        this.#workouts.forEach(work => {
            this._renderWorkout(work);
            this._renderWorkoutMarker(work);
        });
        
    }
    _showForm() {
        form.classList.remove('hidden');
        inputDistance.focus();
    }
    _toggleElevationField() {
        inputCadence.closest('.form__row').classList.toggle('form__row--hidden');
        inputElevation.closest('.form__row').classList.toggle('form__row--hidden');
        this._clearFields();
    }

    _newWorkout(event) {
        const checkInputs = (...inputs) => inputs.every(inp => Number.isFinite(inp));
        const checkIsPositive = (...inputs) => inputs.every(inp => inp > 0);

        event.preventDefault();
        //get data from form
        const selectedType = inputType.value;
        const distance = +inputDistance.value;
        const duration = +inputDuration.value;
        let workout;
        //perform validation
        if (selectedType === 'running') {
            const cadence = +inputCadence.value;
            if (!checkInputs(distance, duration, cadence) || !checkIsPositive(distance, duration, cadence)) {
                return alert("input should be positive numbers!");
            }
            workout = new Running(this.#coords, distance, duration, cadence);
        } else if (selectedType === 'cycling') {
            const elevationGain = +inputElevation.value;
            if (!checkInputs(distance, duration, elevationGain) || !checkIsPositive(distance, duration)) {
                return alert("input should be positive numbers!");
            }
            workout = new Cycling(this.#coords, distance, duration, elevationGain);
        }

        //add workout to the array
        this.#workouts.push(workout);
        
        //display marker
        this._renderWorkoutMarker(workout);
        
        //render workout
        this._renderWorkout(workout);
        
        //hide form
        form.classList.add('hidden');
        
        //reset form fields
        this._resetForm();

        //update local storage
        this._setLocalStorage();
    }

    _setLocalStorage() {
        localStorage.setItem('workouts',JSON.stringify(this.#workouts));
    }

    _getWorkOutsFromLocalStorage() {
        const workoutStr = localStorage.getItem('workouts');
        return JSON.parse(workoutStr);
    }

    _renderWorkoutMarker(workout) {
        L.marker(workout.coords).addTo(this.#map)
            .bindPopup(L.popup({
                maxWidth: 250,
                minWidth: 100,
                autoClose: false,
                closeOnClick: false,
                className: `${workout._name}-popup`
            })).setPopupContent(`${workout._name==='cycling'?'🚴‍♀️':'🏃‍♂️'} ${workout._description}`)
            .openPopup();
    }

    _renderWorkout(workout) {
        let html = `
        <li class="workout workout--${workout._name}" data-id="${workout._id}">
        <h2 class="workout__title">${workout._description}</h2>
        <div class="workout__details">
          <span class="workout__icon">${workout._name==='cycling'?'🚴‍♀️':'🏃‍♂️'}</span>
          <span class="workout__value">${workout.distance}</span>
          <span class="workout__unit">km</span>
        </div>
        <div class="workout__details">
          <span class="workout__icon">⏱</span>
          <span class="workout__value">${workout.duration}</span>
          <span class="workout__unit">min</span>
        </div>
        `;
        if(workout._name==='running') {
            html+=`
            <div class="workout__details">
            <span class="workout__icon">⚡️</span>
            <span class="workout__value">${workout.pace.toFixed(1)}</span>
            <span class="workout__unit">min/km</span>
          </div>
          <div class="workout__details">
            <span class="workout__icon">🦶🏼</span>
            <span class="workout__value">${workout.cadence}</span>
            <span class="workout__unit">spm</span>
          </div>
            `;
        } else if (workout._name==='cycling') {
            html+=`
            <div class="workout__details">
            <span class="workout__icon">⚡️</span>
            <span class="workout__value">${workout.speed.toFixed(1)}</span>
            <span class="workout__unit">km/h</span>
            </div>
            <div class="workout__details">
            <span class="workout__icon">⛰</span>
            <span class="workout__value">${workout.elevationGain}</span>
            <span class="workout__unit">m</span>
            </div>
            `;            
        }

        html+='</li>';
        form.insertAdjacentHTML('afterend',html);
    }

    _moveToMarker(event) {
        const li = event.target.closest('.workout');
        if (li) {
            const workout = this.#workouts.find(work => li.dataset.id === work._id);
            this.#map.setView(workout.coords, 14, {
                animate: true,
                pan: {
                    duration: 1
                }
            })
        }
    }
    
    _resetForm() {
        form.classList.add('hidden');
        inputType.value = 'running';
        this._clearFields();
    }

    _clearFields() {
        inputDistance.value = '';
        inputCadence.value = '';
        inputDuration.value = '';
        inputElevation.value = '';
    }
}

new App();