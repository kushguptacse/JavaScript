'use strict';

///////////////////////////////////////
// Modal window

const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');
const btnScroll = document.querySelector(".btn--scroll-to");
const section1 = document.querySelector("#section--1");
const tabs = document.querySelectorAll('.operations__tab');
const tabsContainer = document.querySelector('.operations__tab-container');
const tabsContent = document.querySelectorAll('.operations__content');

const openModal = function (event) {
  event.preventDefault();
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
};

const closeModal = function () {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
};

const scrollEvent = () =>  section1.scrollIntoView({behavior:'smooth'});
btnScroll.addEventListener('click',scrollEvent);

btnsOpenModal.forEach(model=>model.addEventListener('click',openModal));

btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});

//attach click event parent link instead of assigning to each child link
document.querySelector('.nav__links').addEventListener('click', event => {
  event.preventDefault();
  if(event.target.classList.contains('nav__link')) {
    const id = event.target.getAttribute("href");
    document.querySelector(id).scrollIntoView({behavior:'smooth'});
  }
});

tabsContainer.addEventListener('click',event => {
  const clicked = event.target.closest('.operations__tab');
  if(clicked) {
    tabs.forEach( t => t.classList.remove('operations__tab--active'));
    tabsContent.forEach( c => c.classList.remove('operations__content--active'));
    clicked.classList.add('operations__tab--active');
    document.querySelector(`.operations__content--${clicked.dataset.tab}`).classList.add('operations__content--active');
  }
});

(() => {
  const header = document.querySelector('.header');
  //create div element
  const msg = document.createElement('div');
  //add cookie-message class to div
  msg.classList.add('cookie-message');
  //add innerHTMl
  msg.innerHTML='We use Cookies. please accept <button class="btn btn--close--cookie">accept</button>';
  
  //add message element to the end of header.
  header.append(msg);
  
  //delete message div on click of accept
  document.querySelector('.btn--close--cookie').addEventListener('click',()=>msg.remove());
  })();
  