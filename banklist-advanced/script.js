'use strict';

///////////////////////////////////////
// Modal window

const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');

const openModal = function (event) {
  event.preventDefault();
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
};

const closeModal = function () {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
};

btnsOpenModal.forEach(model=>model.addEventListener('click',openModal));

btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});

//practice - add cookie
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
