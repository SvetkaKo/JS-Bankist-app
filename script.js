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

//Implementing Login
let currentAccount;

const updateUI = function (account) {
  //Display movements
  displayMovements(account.movements);
  //Display balance
  calcAndDisplayPrintBalance(account);
  //Display summary
  calcDisplaySum(account);
};

btnLogin.addEventListener('click', function (event) {
  event.preventDefault();

  currentAccount = accounts.find(
    el => el.username === inputLoginUsername.value
  );

  if (currentAccount?.pin === Number(inputLoginPin.value)) {
    //Display UI and message
    labelWelcome.textContent = `Welcome back, ${
      currentAccount.owner.split(' ')[0]
    }!`;
    containerApp.style.opacity = 100;
    //Clear input fields
    inputLoginUsername.value = '';
    inputLoginPin.value = '';

    updateUI(currentAccount);
  }
});

btnLoan.addEventListener('click', function (event) {
  event.preventDefault();
  console.log('clicked');
  const requestedLoan = Number(inputLoanAmount.value);
  if (
    requestedLoan > 0 &&
    currentAccount.movements.some(el => el >= 0.1 * requestedLoan)
  )
    console.log(requestedLoan, 'valid request');
  currentAccount.movements.push(requestedLoan);
  updateUI(currentAccount);
  inputLoanAmount.value = '';
});

let sorted = false;

btnSort.addEventListener('click', function (event) {
  event.preventDefault();

  displayMovements(currentAccount.movements, !sorted);
  sorted = !sorted;
});

//Display movements
const displayMovements = function (movements, sort = false) {
  containerMovements.innerHTML = '';

  const movs = sort ? movements.slice().sort((a, b) => a - b) : movements;

  movs.forEach((mov, index) => {
    const type = mov > 0 ? 'deposit' : 'withdrawal';
    const html = `
        <div class="movements__row">
          <div class="movements__type movements__type--${type}">${
      index + 1
    } ${type}</div>
          <div class="movements__date">3 days ago</div>
          <div class="movements__value">${mov}</div>
        </div>
        `;
    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};

//Create username
const createUserNames = function (accounts) {
  accounts.map(account => {
    account.username = account.owner
      .toLowerCase()
      .split(' ')
      .map(word => word[0])
      .join('');
  });
};
createUserNames(accounts);

//Print Main Balance
const calcAndDisplayPrintBalance = function (acc) {
  acc.balance = acc.movements.reduce((acc, el) => acc + el, 0);
  labelBalance.textContent = `${acc.balance} EUR`;
};

//Calc summary
const calcDisplaySum = function (account) {
  const incom = account.movements
    .filter(el => el > 0)
    .reduce((sum, el) => sum + el, 0);
  labelSumIn.textContent = `${incom}`;

  const outcome = account.movements
    .filter(el => el < 0)
    .reduce((sum, el) => sum + el, 0);
  labelSumOut.textContent = `${Math.abs(outcome)}`;

  const interest = account.movements
    .filter(el => el > 0)
    .map(deposit => (deposit * account.interestRate) / 100)
    .filter(el => el > 1)
    .reduce((sum, el) => sum + el, 0);
  labelSumInterest.textContent = `${interest}`;
};
//Transfer money
btnTransfer.addEventListener('click', function (event) {
  event.preventDefault();
  const amount = Number(inputTransferAmount.value);
  const receiveeAcc = accounts.find(
    account => account.username === inputTransferTo.value
  );

  if (
    amount > 0 &&
    receiveeAcc &&
    currentAccount.balance >= amount &&
    currentAccount.username !== receiveeAcc.username
  ) {
    receiveeAcc.movements.push(amount);
    currentAccount.movements.push(-amount);

    updateUI(currentAccount);
  }
  inputTransferAmount.value = inputTransferTo.value = '';
});

//Close account
btnClose.addEventListener('click', function (event) {
  event.preventDefault();

  if (
    currentAccount.pin === Number(inputClosePin.value) &&
    currentAccount.username === inputCloseUsername.value
  ) {
    const index = accounts.findIndex(
      account => account.username === currentAccount.username
    );

    accounts.splice(index, 1);
    containerApp.style.opacity = 0;
  }
  inputCloseUsername.value = inputClosePin.value = '';
  labelWelcome.textContent = 'Log in to get started';
});

//autologin
// updateUI(account1);
// containerApp.style.opacity = 100;

// console.log(createUserNames(accounts));

/////////LECTURES
/*

movements.find(el => el < 0);


const deposits = movements.filter(el => el > 0);
const withdrawals = movements.filter(el => el < 0);
console.log(deposits, withdrawals);

const maxMov = movements.reduce((acc, el) => (acc < el ? el : acc));
console.log(maxMov);

const eurToUSD = 1.1;

const movementsUSD = movements.map(el => el * eurToUSD);
console.log(movementsUSD);


const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];
const test = el => el < 0;
console.log(movements.some(test));
console.log(movements.every(test));
console.log(movements.includes(450));
console.log(movements.filter(test));


const summary = accounts
  .map(el => el.movements)
  .flat()
  .reduce((sum, el) => (sum += el), 0);
console.log(summary);

const summary1 = accounts
  .flatMap(el => el.movements)
  .reduce((sum, el) => (sum += el), 0);
console.log(summary1);
// console.log(summary.flat().reduce((sum, el) => ((sum += el), 0)));


const movements = [200, 450, -400, 3000, -650, -130, 70, 1300, 0];
console.log(movements);
console.log(movements.sort());
console.log(movements.sort((a, b) => (a > b ? 1 : -1)));
console.log(movements.sort((a, b) => a - b));



const arr = new Array(7);
console.log(arr.fill(1));

const y = Array.from({ length: 7 }, () => 1);
console.log(y);

const z = Array.from({ length: 7 }, (_, i) => i + 1);
console.log(z);

const diceRolls = Array.from(
  { length: 100 },
  (el, i) => (el = Math.ceil(Math.random() * 6))
);
console.log(diceRolls);



//1/
const bankDepositSum = accounts
  .flatMap(el => el.movements)
  .filter(el => el > 0)
  .reduce((sum, el) => (sum += el), 0);
console.log(bankDepositSum);

//2.
const bankDeposit1000 = accounts
  .flatMap(el => el.movements)
  .reduce((count, el) => (el >= 1000 ? ++count : count), 0);
console.log(bankDeposit1000);

//3.
const sums = accounts
  .flatMap(el => el.movements)
  .reduce(
    (sums, el) => {
      el > 0 ? (sums.deposits += el) : (sums.withdrawls += el);
      return sums;
    },
    { deposits: 0, withdrawls: 0 }
  );
console.log(sums);

//4.
const convertTitle = function (array) {
  const capitalizer = str => str[0].toUpperCase() + str.slice(1);
  const exeptions = ['a', 'an', 'the', 'but', 'or', 'on', 'in', 'with'];
  return capitalizer(
    array
      .toLowerCase()
      .split(' ')
      .map(el => (exeptions.includes(el) ? el : capitalizer(el)))
      .join(' ')
  );
};
console.log(convertTitle('this is a nice title'));
console.log(convertTitle('this is a nice TITLE'));
console.log(convertTitle('this is a nice TITLE but not the ideal'));
console.log(
  convertTitle('and this is a quit nice title too but not the ideal')
);


// Julia and Kate are still studying dogs, and this time they are studying if dogs are
// eating too much or too little.
// Eating too much means the dog's current food portion is larger than the
// recommended portion, and eating too little is the opposite.
// Eating an okay amount means the dog's current food portion is within a range 10%
// above and 10% below the recommended portion (see hint).
// Your tasks:

const dogs = [
  { weight: 22, curFood: 250, owners: ['Alice', 'Bob'] },
  { weight: 8, curFood: 200, owners: ['Matilda'] },
  { weight: 13, curFood: 275, owners: ['Sarah', 'John'] },
  { weight: 32, curFood: 340, owners: ['Michael'] },
];

// 1. Loop over the 'dogs' array containing dog objects, and for each dog, calculate
// the recommended food portion and add it to the object as a new property. Do
// not create a new array, simply loop over the array. Forumla:
// recommendedFood = weight ** 0.75 * 28. (The result is in grams of
// food, and the weight needs to be in kg)

dogs.forEach(dog => (dog.recFood = Math.round(dog.weight ** 0.75 * 28)));
console.log(dogs);

// 2. Find Sarah's dog and log to the console whether it's eating too much or too
// little. Hint: Some dogs have multiple owners, so you first need to find Sarah in
// the owners array, and so this one is a bit tricky (on purpose) 🤓

const dogSarah = dogs.find(dog => dog.owners.includes('Sarah'));
console.log(
  dogSarah.curFood > dogSarah.recFood
    ? `it's eating too much`
    : `it's eating too little`
);

// 3. Create an array containing all owners of dogs who eat too much
// ('ownersEatTooMuch') and an array with all owners of dogs who eat too little
// ('ownersEatTooLittle').

let eatTooLitlle = [];
let eatTooMuch = [];
dogs.filter(dog =>
  dog.recFood > dog.curFood
    ? eatTooLitlle.push(dog.owners)
    : eatTooMuch.push(dog.owners)
);
eatTooLitlle = eatTooLitlle.flat();
eatTooMuch = eatTooMuch.flat();
console.log(eatTooLitlle, eatTooMuch);

// 4. Log a string to the console for each array created in 3., like this: "Matilda and
// Alice and Bob's dogs eat too much!" and "Sarah and John and Michael's dogs eat
// too little!"

let str1 = `${eatTooLitlle.join(' and ')}'s dogs eat too little!`;
let str2 = `${eatTooMuch.join(' and ')}'s dogs eat too much!`;
console.log(str1);
console.log(str2);

// 5. Log to the console whether there is any dog eating exactly the amount of food
// that is recommended (just true or false)

console.log(dogs.some(dog => dog.recFood === dog.curFood));

// 6. Log to the console whether there is any dog eating an okay amount of food
// (just true or false)

console.log(
  dogs.some(
    dog => dog.curFood > dog.recFood * 0.9 && dog.curFood < dog.recFood * 1.1
  )
);

// 7. Create an array containing the dogs that are eating an okay amount of food (try
// to reuse the condition used in 6.)

const fineAmountFood = dogs.filter(
  dog => dog.curFood > dog.recFood * 0.9 && dog.curFood < dog.recFood * 1.1
);
console.log(fineAmountFood);

// 8. Create a shallow copy of the 'dogs' array and sort it by recommended food
// portion in an ascending order (keep in mind that the portions are inside the
// array's objects 😉)

// console.log(movements.sort((a, b) => a - b));
let sorted1 = dogs.slice().sort((doga, dogb) => doga.recFood - dogb.recFood);
console.log(dogs);
console.log(sorted1);

*/
