'use strict';

const message = document.querySelector(".message");
const buttonCheck = document.querySelector("button.check");
const guess = document.querySelector('input.guess');
const score = document.querySelector('span.score');
const highScore = document.querySelector('span.highscore');
const buttonAgain = document.querySelector("button.again");
const numberDiv = document.querySelector("div.number");
let secretNum = Math.floor(Math.random()*20) + 1;
let scoreCount=20;
let body = document.querySelector("body");
buttonAgain.addEventListener('click',()=>{
    message.textContent="Start guessing...";
    score.textContent=20;
    guess.value="";
    scoreCount=20;
    secretNum = Math.floor(Math.random()*20)+1;
    numberDiv.textContent="?";
    numberDiv.style.width="15rem";
    body.style.backgroundColor="#222";
});
buttonCheck.addEventListener("click", () => {
    console.log(secretNum);
    if(guess.value && scoreCount>0){
        const guessNum = Number(guess.value);
        scoreCount--;
        if(guessNum===secretNum) {
            message.textContent = "congrats!!! right guess";
            if(Number(highScore.textContent)<scoreCount) {
                highScore.textContent = scoreCount;
            }
            numberDiv.textContent=secretNum;
            numberDiv.style.width="30rem";
            body.style.backgroundColor="#60b347";
        } else {
            message.textContent = guessNum<secretNum? "Too Low":"Too High";
        }
        if(scoreCount==0) {
            message.textContent = "You lost the game!!!";
            numberDiv.textContent=secretNum;
            numberDiv.style.width="30rem";
            body.style.backgroundColor="indianred";
        }
        score.textContent=scoreCount;
    } 
});