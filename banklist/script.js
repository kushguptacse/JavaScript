'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: 'Steven Thomas Williams',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: 'Sarah Smith',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const accounts = [account1, account2, account3, account4];

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


const displayMovements = function(movements, sorted=false) {
  containerMovements.innerHTML='';
  const movs = sorted?movements.slice().sort((a,b)=>a-b):movements;
  movs.forEach(function(movement,i) {
    const isDeposit = movement<0?'withdrawal':'deposit';
    const movementContent = `
<div class="movements__row">
  <div class="movements__type movements__type--${isDeposit}">${i+1} ${isDeposit}</div>
  <div class="movements__date">3 days ago</div>
  <div class="movements__value">${Math.abs(movement)}€</div>
</div>`;
    containerMovements.insertAdjacentHTML("afterbegin",movementContent);
  });
  
}

const calcDisplayBalance = function(acct) {
  const balance = acct.movements.reduce((res,mov)=>res+mov,0);
  labelBalance.textContent = balance + '€';
  acct.balance = balance;
}

const calcDisplaySummary = function(acct) {
  const incoming = acct.movements.filter(mov=>mov>0).reduce((res,mov)=>res+mov,0);
  const outgoing = acct.movements.filter(mov=>mov<0).reduce((res,mov)=>res+mov,0);
  const interest = acct.movements.filter(mov=>mov>0).map(mov=>(mov*acct.interestRate)/100)
   .filter(int=>int>=1).reduce((res,int)=>res+int,0);
  labelSumIn.textContent = incoming + '€';
  labelSumOut.textContent = Math.abs(outgoing) + '€';
  labelSumInterest.textContent=interest+'€';
}

const createUserNames = function(accts) {
  accts.forEach(account=>account.username = account.owner.split(" ").map(mov=>mov[0]).join("").toLowerCase());
}

let currentAccount;

const loggin = function(event,accts) {
  event.preventDefault();
  const username = inputLoginUsername.value;
  const pin = Number(inputLoginPin.value);
  currentAccount = accts.find(account=>username===account.username && account.pin === pin);
  if(currentAccount) {
    labelWelcome.textContent = `Welcome back, ${currentAccount.owner.split(" ")[0]}`;
    refreshUI(currentAccount);
    containerApp.style.opacity = 100;
  } else {
    containerApp.style.opacity = 0;
    labelWelcome.textContent = 'Log in to get started';
  }
  inputLoginUsername.value='';
  inputLoginPin.value='';
  inputLoginPin.blur(); 
}
const refreshUI = function(acct) {
  displayMovements(acct?.movements);
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
  }
  inputCloseUsername.value='';
  inputClosePin.value='';
}

const loan = function(event){
  //loan can be given if  at least 1 deposit > 10% of the requested amount.
  event.preventDefault();
  const amt = Number(inputLoanAmount.value);
  if(amt>0 && currentAccount.movements.some(mov=>mov>=amt*0.1)) {
    currentAccount.movements.push(amt);
    refreshUI(currentAccount);
  }
  inputLoanAmount.value='';
}

let sorted = false;
const sort = function(event) {
  event.preventDefault();
  sorted =!sorted;
  displayMovements(currentAccount.movements,sorted);  
}

btnLogin.addEventListener('click',e=>loggin(e,accounts));
btnTransfer.addEventListener('click',e=>transfer(e,accounts));
btnClose.addEventListener('click',e=>closeAccount(e,accounts));
btnLoan.addEventListener('click',loan);
btnSort.addEventListener('click',e=>sort(e,accounts));
createUserNames(accounts);
