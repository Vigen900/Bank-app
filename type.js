const globalData = {
  amount: 0,
  index: 0,
  type: 'Mutq',
};

class BankAccount {
  constructor(balance, owner) {
    this.balance = balance
    this.owner = owner
    this.transactions = []
  }

  deposit(amount) {
    const newTransaction = new Transaction('Mutq', amount, new Date())
    this.transactions.push(newTransaction)
    return this.balance += amount
  }

  withdraw(amount) {
    const newTransaction = new Transaction('Elq', amount, new Date())
    this.transactions.push(newTransaction)
    return this.balance -= amount
  }
}

const MyBankAccount = new BankAccount(1000, 'Armen')

class Transaction {
  constructor(type, amount, data) {
    this.type = type
    this.amount = amount
    this.data = data
  }
}

function addMoney() {
  let incomeMoney = +prompt('Enter amount for deposit')
  MyBankAccount.deposit(incomeMoney)
  document.querySelector('.balance').innerHTML = '$' + MyBankAccount.balance.toFixed(2);
}

function getMoney() {
  let incomeMoney = +prompt('Enter amount for withdraw')
  if (incomeMoney > MyBankAccount.balance) {
    return getMoney()
  } else {
    MyBankAccount.withdraw(incomeMoney)
    document.querySelector('.balance').innerHTML = '$' + MyBankAccount.balance.toFixed(2);
  }
}

function formatDate(date) {
  const options = {
    day: 'numeric',
    month: 'long',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  };

  const formattedDate = date.toLocaleDateString('en-US', options)
  return formattedDate;
}

function yourPass() {
  const password = prompt('Enter your password!!!');
  if (password == '1') {
    alert('Your password is correct, buttons is unlocked, Thank You!')
    document.getElementById('showCvv').disabled = false;
    document.getElementById('addMoney').disabled = false;
    document.getElementById('getMoney').disabled = false;
    document.getElementById('history').disabled = false;
    const result1 = document.querySelector('.transaction').innerHTML = ('History is empty')
    const result2 = document.querySelector('.balance').innerHTML = '$' + MyBankAccount.balance.toFixed(2);
    const result3 = document.querySelector('.card-back').innerHTML = ('123')
    return (result1, result2, result3)
  } else {
    alert('Wrong password!!!');
  }
}

function filterTransaction(formElement) {
  const formData = new FormData(formElement.target);
  const fromData = formData.get('fromData');
  const toData = formData.get('toData');
  const selected = formData.get('dateList');
  const filter = MyBankAccount.transactions.filter(function (transaction) {
    return (transaction.amount >= (+formData.get("from")) &&
      transaction.amount <= (+formData.get("to"))) &&
      transaction.data >= new Date(fromData) &&
      transaction.data <= new Date(toData) &&
      (transaction.type == selected || selected == 'All')
  });

  render(filter);
}

function render(history) {
  document.querySelector('.transaction').innerHTML = '';

  history.forEach(function (transaction, index) {
    const transactionElement = document.createElement('li');
    transactionElement.classList.add('history-item');

    transactionElement.setAttribute('data-index', index);
    transactionElement.setAttribute('data-amount', transaction.amount);
    transactionElement.setAttribute('data-type', transaction.type);

    transactionElement.textContent = transaction.amount + '$ -' + formatDate(transaction.data);
    // transactionElement.innerHTML += `
    //   <button onclick="repeat('${transaction.amount}', '${transaction.type}')">repeat</button>
    //   <button onclick="deleteTransaction(${index})"> delete </button>
    // `;

    if (transaction.type == 'Mutq') {
      transactionElement.style.color = 'green';
    } else {
      transactionElement.style.color = 'red';
    }
    document.querySelector('.transaction').appendChild(transactionElement);
  });

  const light = new ContextMenu({
    target: ".history-item",
    mode: "light",
    menuItems
  });

  light.init();
}

function repeat(amount, type) {
  if (!amount || !type) {
    amount = getGlobalValues().amount;
    type = getGlobalValues().type;
  }

  if (type == 'Mutq') {
    MyBankAccount.deposit(+amount)
    document.querySelector('.balance').innerHTML = '$' + MyBankAccount.balance.toFixed(2);
  } else {
    MyBankAccount.withdraw(+amount)
    document.querySelector('.balance').innerHTML = '$' + MyBankAccount.balance.toFixed(2);
  }
  render(MyBankAccount.transactions);
};

function deleteTransaction(index) {
  let deleteIndex = index || getGlobalValues()?.index;
  
  if (deleteIndex !== -1) {
    MyBankAccount.transactions.splice(deleteIndex, 1);
    document.querySelector('.balance').innerHTML = '$' + MyBankAccount.balance.toFixed(2);
  }
  render(MyBankAccount.transactions);
}

function getHistory() {
  render(MyBankAccount.transactions);
}


const repeatIcon = '<svg viewBox="0 0 24 24" width="13" height="13" stroke="currentColor" stroke-width="2.5" style="margin-right: 7px" fill="none" stroke-linecap="round" stroke-linejoin="round" class="css-i6dzq1"><circle cx="12" cy="12" r="10"></circle><path d="M8 14V9l4 4v1m0 4v-1l4-4v-1"></path></svg>'
const deleteIcon = '<svg viewBox="0 0 24 24" width="13" height="13" stroke="currentColor" stroke-width="2.5" fill="none" style="margin-right: 7px" stroke-linecap="round" stroke-linejoin="round" class="css-i6dzq1"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>';

const menuItems = [
  {
    content: `${repeatIcon}Repeat`,
    divider: "top",
    events: {
      click: (e) => {repeat()}
    }
  },
  {
    content: `${deleteIcon}Delete`,
    events: {
      click: (e) => deleteTransaction()
    }
  }
];

function setGlobalValues(amount, type, index) {
  globalData.amount = amount;
  globalData.type = type;
  globalData.index = index;
}

function getGlobalValues() {
  return globalData;
}

function removeMessage(e) {
  if (e.target.classList.contains('history-item')) {
    const amount = e.target.getAttribute('data-amount');
    const type = e.target.getAttribute('data-type');
    const index = e.target.getAttribute('data-index');

    setGlobalValues(amount, type, index);
  }

  const message = document.querySelector(".right-click");
  if (message) message.remove();
}

window.addEventListener("click", removeMessage);
window.addEventListener("contextmenu", removeMessage);