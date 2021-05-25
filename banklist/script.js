'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// DIFFERENT DATA! Contains movement dates, currency and locale

const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 455.23, -306.5, 25000, -642.21, -133.9, 79.97, 1300],
  interestRate: 1.2, // %
  pin: 1111,

  movementsDates: [
    '2019-11-18T21:31:17.178Z',
    '2019-12-23T07:42:02.383Z',
    '2020-01-28T09:15:04.904Z',
    '2020-04-01T10:17:24.185Z',
    '2020-05-08T14:11:59.604Z',
    '2020-05-27T17:01:17.194Z',
    '2021-05-18T23:36:17.929Z',
    '2021-05-20T10:51:36.790Z',
  ],
  currency: 'EUR',
  locale: 'pt-PT', // de-DE
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,

  movementsDates: [
    '2019-11-01T13:15:33.035Z',
    '2019-11-30T09:48:16.867Z',
    '2019-12-25T06:04:23.907Z',
    '2020-01-25T14:18:46.235Z',
    '2020-02-05T16:33:06.386Z',
    '2020-04-10T14:43:26.374Z',
    '2020-06-25T18:49:59.371Z',
    '2020-07-26T12:01:20.894Z',
  ],
  currency: 'INR',
  locale: 'en-IN',
};

const accounts = [account1, account2];

/////////////////////////////////////////////////
// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

let currentAccount;
let sorted = false;
let timer;
const getDate = (date,locale,options) => new Intl.DateTimeFormat(locale,options).format(date);

const displayMovements = function(acct, sorted=false) {
  containerMovements.innerHTML='';
  const movements = acct.movements;
  const movs = sorted?movements.slice().sort((a,b)=>a-b):movements;
  movs.forEach(function(movement,i) {
    const isDeposit = movement<0?'withdrawal':'deposit';
    const movementContent = `
<div class="movements__row">
  <div class="movements__type movements__type--${isDeposit}">${i+1} ${isDeposit}</div>
  <div class="movements__date">${formatDate(new Date(acct.movementsDates[i]), acct.locale)}</div>
  <div class="movements__value">${formatCurr(Math.abs(movement),acct.locale,acct.currency)}</div>
</div>`;
    containerMovements.insertAdjacentHTML("afterbegin",movementContent);
  });
  
}

const formatCurr = function (value,locale, curr) {
  return new Intl.NumberFormat(locale,{
    style:'currency',currency:curr
  }).format(value);
};

const formatDate = (date,locale,options) => {
  const calcDaysPassed = (date1,date2)=>Math.round(Math.abs(date1-date2)/(1000*60*60*24));
  const days = calcDaysPassed(new Date(),date);
  let formattedDate;
    if(days==0) {
      formattedDate = 'Today';
    } else if (days==1) {
      formattedDate = 'Yesterday';
    } else if (days<=7) {
      formattedDate = `${days} days ago`;
    } else {
      formattedDate = getDate(date,locale,options);
    }
  return formattedDate;
}

const calcDisplayBalance = function(acct) {
  const balance = acct.movements.reduce((res,mov)=>res+mov,0);
  labelBalance.textContent = formatCurr(balance,acct.locale,acct.currency);
  acct.balance = balance;
}

const calcDisplaySummary = function(acct) {
  const incoming = acct.movements.filter(mov=>mov>0).reduce((res,mov)=>res+mov,0);
  const outgoing = acct.movements.filter(mov=>mov<0).reduce((res,mov)=>res+mov,0);
  const interest = acct.movements.filter(mov=>mov>0).map(mov=>(mov*acct.interestRate)/100)
   .filter(int=>int>=1).reduce((res,int)=>res+int,0);
  labelSumIn.textContent = formatCurr(incoming,acct.locale,acct.currency);
  labelSumOut.textContent = formatCurr(Math.abs(outgoing),acct.locale,acct.currency);
  labelSumInterest.textContent=formatCurr(interest,acct.locale,acct.currency);
}

const createUserNames = function(accts) {
  accts.forEach(account=>account.username = account.owner.split(" ").map(mov=>mov[0]).join("").toLowerCase());
}

const loggin = function(event,accts) {
  event.preventDefault();
  const username = inputLoginUsername.value;
  const pin = Number(inputLoginPin.value);
  currentAccount = accts.find(account=>username===account.username && account.pin === pin);
  if(currentAccount) {
    labelWelcome.textContent = `Welcome back, ${currentAccount.owner.split(" ")[0]}`;
    if(timer) {
      clearInterval(timer);
    }
    startLogoutTimer();
    refreshUI(currentAccount);
    containerApp.style.opacity = 100;
    labelDate.textContent=getDate(new Date(),currentAccount.locale,{
      hour:'numeric',
      minute:'numeric',
      year:'numeric',
      day:'numeric',
      month:'numeric'
    });
  } else {
    containerApp.style.opacity = 0;
    labelWelcome.textContent = 'Log in to get started';
  }
  inputLoginUsername.value='';
  inputLoginPin.value='';
  inputLoginPin.blur(); 
  
}
const refreshUI = function(acct) {
  displayMovements(acct);
  calcDisplayBalance(acct);
  calcDisplaySummary(acct);
}
const transfer = function(event,accounts) {
  event.preventDefault();
  const accountTo = accounts.find(acct=>acct.username===inputTransferTo.value);
  const amount = Number(inputTransferAmount.value);
  if(accountTo && amount>0 && currentAccount.balance>amount && accountTo.username !==currentAccount.username){
    currentAccount.movements.push(-amount);
    accountTo.movements.push(amount);
    currentAccount.movementsDates.push(new Date().toISOString());
    accountTo.movementsDates.push(new Date().toISOString());
    restartTimer();
    refreshUI(currentAccount);
  }
  inputTransferAmount.value='';
  inputTransferTo.value='';
};

const closeAccount = function(event,accounts) {
  event.preventDefault();
  const valid = currentAccount.username===inputCloseUsername.value && currentAccount.pin===Number(inputClosePin.value);
  if(valid) {
    const accountIndex = accounts.findIndex(acct=>acct.username===currentAccount.username);
    accounts.splice(accountIndex,1);
    containerApp.style.opacity = 0;
    labelWelcome.textContent = 'Log in to get started';
    currentAccount={};
    inputLoginUsername.value='';
    inputLoginPin.value='';
    inputLoginPin.blur(); 
  }
  inputCloseUsername.value='';
  inputClosePin.value='';
}

const loan = function(event){
  //loan can be given if  at least 1 deposit > 10% of the requested amount.
  event.preventDefault();
  const amt = Math.floor(inputLoanAmount.value);
  if(amt>0 && currentAccount.movements.some(mov=>mov>=amt*0.1)) {
    setTimeout(()=>{
      currentAccount.movements.push(amt);
      currentAccount.movementsDates.push(new Date().toISOString());
      restartTimer();
      refreshUI(currentAccount);  
    },2500);
  }
  inputLoanAmount.value='';
}

const sort = function(event) {
  event.preventDefault();
  sorted =!sorted;
  displayMovements(currentAccount,sorted);  
  restartTimer();
}

const startLogoutTimer = ()=> {
  let time = 30;
  const tick = ()=>{
    const min = String(Math.trunc(time/60)).padStart(2,'0');
    const sec = String(time%60).padStart(2,'0');
    labelTimer.textContent=`${min}:${sec}`;
    if(time === 0) {
      logout();
    }
    time--;
  }
  timer = setInterval(tick,1000);
  tick();
  const logout = () => {
    clearInterval(timer);
    containerApp.style.opacity = 0;
    labelWelcome.textContent = 'Log in to get started'; 
    currentAccount={};
  };
}

const restartTimer = ()=> {
  clearInterval(timer);
  startLogoutTimer();
}

btnLogin.addEventListener('click',e=>loggin(e,accounts));
btnTransfer.addEventListener('click',e=>transfer(e,accounts));
btnClose.addEventListener('click',e=>closeAccount(e,accounts));
btnLoan.addEventListener('click',loan);
btnSort.addEventListener('click',e=>sort(e,accounts));
createUserNames(accounts);

