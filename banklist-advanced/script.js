'use strict';

//////////////////////////////////////

const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');
const btnScroll = document.querySelector(".btn--scroll-to");
const section1 = document.querySelector("#section--1");
const tabs = document.querySelectorAll('.operations__tab');
const tabsContainer = document.querySelector('.operations__tab-container');
const tabsContent = document.querySelectorAll('.operations__content');
const nav = document.querySelector('.nav');
const header = document.querySelector('.header');
const allSections = document.querySelectorAll('.section');

// Modal window
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

//tab content display logic
tabsContainer.addEventListener('click',event => {
  const clicked = event.target.closest('.operations__tab');
  if(clicked) {
    tabs.forEach( t => t.classList.remove('operations__tab--active'));
    tabsContent.forEach( c => c.classList.remove('operations__content--active'));
    clicked.classList.add('operations__tab--active');
    document.querySelector(`.operations__content--${clicked.dataset.tab}`).classList.add('operations__content--active');
  }
});
//fadeAnimation hover callback function
const fadeAnimationHover = function(link,opacity) {
  if(link.classList.contains('nav__link')) {
    const siblings = link.closest('.nav').querySelectorAll('.nav__link');
    const logo = link.closest('.nav').querySelector('img.nav__logo');
    siblings.forEach(el => {if(el!==link) {el.style.opacity=opacity}});
    logo.style.opacity=opacity;
  }
}
//menu fade animation on mouse hover in nav element.
nav.addEventListener('mouseover',event=> fadeAnimationHover(event.target,0.5));
//menu fade animation on mouse hover out from nav element.
nav.addEventListener('mouseout',event=> fadeAnimationHover(event.target,1));

//show cookie
(() => {
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
  
  //sticky navigation via intersection observer api between viewport and header
(() => {
  const navHeight = nav.getBoundingClientRect().height;
  const observerHeaderOption = {
    root:null,
    threshold:0,
    rootMargin:`-${navHeight}px`
  }
  const obsHeaderCallBack = entry=>entry[0].isIntersecting?nav.classList.remove('sticky'):nav.classList.add('sticky');
  new IntersectionObserver(obsHeaderCallBack,observerHeaderOption).observe(header);
  })();

  //apply element visible on scroll via intersection observerHeader api 
  (() => {
    const revealSectionOptions = {
      root:null,
      threshold:0.15
    };

    const revealSection = (entries,observerHeader)=> {
      if(entries[0].isIntersecting) {
        observerHeader.unobserve(entries[0].target);
        entries[0].target.classList.remove('section--hidden');
      }
    };
    const sectionObserver = new IntersectionObserver(revealSection,revealSectionOptions);
    allSections.forEach(sec=>{
      sectionObserver.observe(sec);
      sec.classList.add('section--hidden');
    });
  })();

//slider effect
const slide = () => {
  let curSlide = 0;
  const slides = document.querySelectorAll('.slide');
  const btnLeft = document.querySelector('.slider__btn--left');
  const btnRight = document.querySelector('.slider__btn--right');
  const dotContainer=document.querySelector('.dots');
  slides.forEach((s,i)=>s.style.transform = `translateX(${100*i}%)`);
  const gotoSlide = ()=> slides.forEach((s,i) => s.style.transform=`translateX(${100*(i-curSlide)}%)`);
  const createDots = ()=> slides.forEach((_,i)=>dotContainer.insertAdjacentHTML("beforeend",`<button class="dots__dot" data-slide="${i}"></button>`));
  const deactivateDots = ()=>document.querySelectorAll('.dots__dot').forEach(dot=>dot.classList.remove('dots__dot--active'));
  const rightSlide = () => {
    if(curSlide===slides.length-1) {
      curSlide=0;
    } else {
      curSlide++;
    }
    updateDots(curSlide);
  };
  const leftSlide = () => {
    if(curSlide===0) {
      curSlide=slides.length-1;
    } else {
      curSlide--;
    }
    updateDots(curSlide);
  };
  const init = ()=>{
    createDots();
    updateDots(curSlide);
  };
  const updateDots = dot=>{
    deactivateDots();
    const dotSelected = document.querySelector(`.dots__dot[data-slide="${dot}"]`)
    dotSelected.classList.add('dots__dot--active');
    curSlide=Number(dot);
    gotoSlide();
  };
  init();
  btnRight.addEventListener('click',rightSlide);
  btnLeft.addEventListener('click',leftSlide);
  document.addEventListener('keydown',event => {
    if(event.key==='ArrowRight') {
      rightSlide();
    } else if(event.key==='ArrowLeft') {
      leftSlide();
    }
  });
  dotContainer.addEventListener('click',event=> {
    if(event.target.classList.contains('dots__dot')) {
      updateDots(event.target.dataset.slide);
    }
  });
};

 //lazy loading images via intersection api
 (() => {
    const images = document.querySelectorAll('img[data-src]');
    const loadImage =  (entries,observer)=> {
      if(entries[0].isIntersecting){
        observer.unobserve(entries[0].target);
        entries[0].target.src=entries[0].target.dataset.src;
        entries[0].target.addEventListener('load',event=>event.target.classList.remove('lazy-img'));
      }
    };
    const loadImageObserver = new IntersectionObserver(loadImage,{root:null,threshold:0,rootMargin:'200px'});
    images.forEach(img=>loadImageObserver.observe(img));
 })();

 slide();