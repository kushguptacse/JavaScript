'use strict';
const imageDice = document.querySelector("img.dice");
const diceButton = document.querySelector(".btn--roll");
const newButton = document.querySelector(".btn--new");
const holdButton = document.querySelector(".btn--hold");

const score1 = document.querySelector("p#score--0");
const score2 = document.querySelector("p#score--1");
const currentScore1 = document.querySelector("#current--0");
const currentScore2 = document.querySelector("#current--1");
const player1 = document.querySelector("section.player--0");
const player2 = document.querySelector("section.player--1");
const generateNumberFromDice = ()=>Math.floor(Math.random()*6)+1;

let globalScore;
let currentPlayer;
let currScore;
let playing;

newButton.addEventListener('click',init);

function init(){
    globalScore=[0,0];
    currScore=0;
    currentPlayer=0;
    playing=true;
    score1.textContent=0;
    score2.textContent=0;
    currentScore1.textContent=0;
    currentScore2.textContent=0;
    imageDice.classList.add('hidden');
    player1.classList.remove('player--winner');
    player2.classList.remove('player--winner');
    player1.classList.add('player--active');
    player2.classList.remove('player--active');
}

diceButton.addEventListener('click',()=>{
    if(playing) {
        const dice = generateNumberFromDice();
        displayDice(dice);
        if(dice===1){
           switchPlayer();
        } else {
            //update current player score
            currScore+=dice;
            document.querySelector(`#current--${currentPlayer}`).textContent=currScore;
        }
    }
});


holdButton.addEventListener('click',()=> { 
    if(playing) {
        globalScore[currentPlayer]+=currScore;
        document.querySelector(`p#score--${currentPlayer}`).textContent=globalScore[currentPlayer];
        if(globalScore[currentPlayer]>=100) {
            playing = false;
            document.querySelector(`section.player--${currentPlayer}`).classList.add('player--winner');
            document.querySelector(`section.player--${currentPlayer}`).classList.remove('player--active');
            imageDice.classList.add('hidden');
        } else {
            switchPlayer();
        }
    }     
});

function switchPlayer() {
    currScore=0;
    document.getElementById(`current--${currentPlayer}`).textContent = 0;
    currentPlayer=currentPlayer^1;
    player1.classList.toggle("player--active");
    player2.classList.toggle("player--active");
}

function displayDice(dice) {
    const imageSrc = `dice-${dice}.png`;
    imageDice.src=imageSrc;
    imageDice.classList.remove('hidden');
}

init();
