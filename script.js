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
const dataInfo = document.querySelector('.boddy');

function updateUI(currentUser) {
  displayMovements(currentUser.movements);
  calcPrintBalance(currentUser);
  calcDisplaySummary(currentUser);
}

dataInfo.addEventListener('click', function (e) {
  e.preventDefault();
  //console.log('hello world');
  document.querySelector('.all_data').style.display = 'none';
});

const displayMovements = function (movements, sort = false) {
  containerMovements.innerHTML = '';
  /// console.log('hellow orld');
  ///console.log(sort);
  let movs = sort
    ? movements.slice().sort(function (a, b) {
        return a - b;
      })
    : movements;
  console.log(movs);
  for (let i = 0; i < movs.length; i += 1) {
    const type = movs[i] > 0 ? 'deposit' : 'withdrawal';
    const html = `
        <div class="movements__row">
        <div class="movements__type movements__type--${type}">${
      i + 1
    } ${type}</div>
        <div class="movements__value">${movs[i]} EUR</div>
      </div>
    `;
    containerMovements.insertAdjacentHTML('afterbegin', html);
  }
};

const calcPrintBalance = function (accounts) {
  accounts.balance = accounts.movements.reduce((acc, mov) => acc + mov, 0);
  labelBalance.textContent = `${accounts.balance} EUR`;
};
const calcDisplaySummary = function (accounts) {
  let incomes = accounts.movements
    .filter(function (mov) {
      return mov > 0;
    })
    .reduce(function (acc, mov) {
      return acc + mov;
    }, 0);
  labelSumIn.textContent = `${incomes} EUR`;

  let expenses = accounts.movements
    .filter(function (mov) {
      return mov < 0;
    })
    .reduce(function (acc, mov) {
      return acc + mov;
    }, 0);
  labelSumOut.textContent = `${expenses} EUR`;

  let interest = accounts.movements
    .filter(function (mov) {
      return mov > 0;
    })
    .map(function (mov) {
      return (mov * accounts.interestRate) / 100;
    })
    .reduce(function (arr, mov) {
      return arr + mov;
    }, 0);

  labelSumInterest.textContent = `${interest} EUR`;
};
function createUserID(accs) {
  accs.forEach(function (acc) {
    acc.userName = acc.owner
      .toLowerCase()
      .split(' ')
      .map(function (ele) {
        return ele[0];
      })
      .join('');
  });
}
createUserID(accounts);

let currentUser;

btnLogin.addEventListener('click', function (ele) {
  ele.preventDefault();
  currentUser = accounts.find(function (acc) {
    return acc.userName === inputLoginUsername.value;
  });
  if (currentUser?.pin === Number(inputLoginPin.value)) {
    labelWelcome.textContent = `Welcome Back ${
      currentUser.owner.split(' ')[0]
    }`;
    containerApp.style.opacity = 100;

    inputLoginUsername.value = inputLoginPin.value = '';
    inputLoginPin.blur();
    /// display movements and all---

    updateUI(currentUser);

    console.log('LOGIN');
  }
});
btnTransfer.addEventListener('click', function (ele) {
  ele.preventDefault();
  let amount = Number(inputTransferAmount.value);
  let recipient = accounts.find(function (acc) {
    return acc.userName === inputTransferTo.value;
  });
  inputTransferAmount.value = inputTransferTo.value = '';
  if (
    amount > 0 &&
    recipient &&
    currentUser.balance >= amount &&
    recipient.userName !== currentUser.userName
  ) {
    currentUser.movements.push(-amount);
    recipient.movements.push(amount);
    updateUI(currentUser);
  }
});

btnLoan.addEventListener('click', function (ele) {
  ele.preventDefault();
  let requestAmount = Number(inputLoanAmount.value);
  if (
    requestAmount > 0 &&
    currentUser.movements.some(function (mov) {
      return mov >= requestAmount * 0.1;
    })
  ) {
    currentUser.movements.push(requestAmount);
    updateUI(currentUser);
  }
  inputLoanAmount.value = '';
});

btnClose.addEventListener('click', function (ele) {
  ele.preventDefault();
  if (
    inputCloseUsername.value === currentUser.userName &&
    currentUser?.pin === Number(inputClosePin.value)
  ) {
    let index = accounts.findIndex(function (acc) {
      return acc.userName === currentUser.userName;
    });
    accounts.splice(index, 1);
    containerApp.style.opacity = 0;
  }
  inputCloseUsername.value = inputClosePin.value = '';
  labelWelcome.textContent = `Login to get started `;
});
let sorted = false;
btnSort.addEventListener('click', function (ele) {
  ele.preventDefault();
  displayMovements(currentUser.movements, !sorted);
});
/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES

const currencies = new Map([
  ['USD', 'United States dollar'],
  ['EUR', 'Euro'],
  ['GBP', 'Pound sterling'],
]);

const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

// const arr = movements
//   .filter(function (mov) {
//     return mov > 0;
//   })
//   .map(function (mov) {
//     return mov * 1.1;
//   })
//   .reduce(function (acc, mov) {
//     return acc + mov;
//   }, 0);
// console.log(arr);

/////////////////////////////////////////////////
// let arr = ['a', 'b', 'c', 'd', 'e'];
// let brr = ['f', 'g', 'h', 'i', 'j'];
// console.log(arr.slice(1));
// console.log(arr.slice(2, 4));
// console.log(arr.slice(2, -1));
// console.log([...arr]);
// console.log(arr.slice());
// console.log(arr.splice(2));
// arr.reverse();

// ///concat

// let letters = arr.concat(brr);
// console.log(letters);

// console.log(...arr, ...brr);

// ///join

// console.log(letters.join('-'));
// console.log(letters.jo);
