'use strict';
const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const closeButton = document.querySelector('.close-modal');
const showButton = document.querySelectorAll('.show-modal');

for(let i=0;i<showButton.length;i++) {
    showButton[i].addEventListener("click",()=>{
        modal.classList.remove('hidden');
        overlay.classList.remove('hidden');
    });
}
const closeModel = ()=> {
    modal.classList.add('hidden');
    overlay.classList.add('hidden');
};
closeButton.addEventListener('click',closeModel);
overlay.addEventListener('click',closeModel);
document.addEventListener('keydown',(event)=>{
    if(event.key ==='Escape' && !modal.classList.contains('hidden')) {
        closeModel();
    }
});