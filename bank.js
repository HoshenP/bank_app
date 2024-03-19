document.addEventListener("DOMContentLoaded", function () {
  fetch("nav.html")
    .then((response) => response.text())
    .then((html) => {
      document.getElementById("nav-placeholder").innerHTML = html;
    });
});

class BankAccount {
  constructor(firstName, lastName, id) {
    this.id = id;
    this.firstName = firstName;
    this.lastName = lastName;
    this.accountNumber = this.generateAccountNumber();
    this.balance = 0;
    this.transactions = []; // Array to store transactions
    BankAccount.totalUsers++;

    // Retrieve account data from local storage if available
    const storedAccountData = localStorage.getItem(`bankAccount_${id}`);
    if (storedAccountData) {
      const parsedData = JSON.parse(storedAccountData);
      this.balance = parsedData.balance;
      this.transactions = parsedData.transactions;
    }
  }

  generateAccountNumber() {
    // Generating a random 8-digit account number
    return Math.floor(Math.random() * 90000000) + 10000000;
  }

  deposit(amount) {
    this.balance += amount;
    BankAccount.totalMoney += amount;
    const transaction = { type: "deposit", date: new Date(), amount: amount };
    this.transactions.push(transaction);
    this.saveToLocalStorage(); // Save account data to local storage
    return `Successfully deposited שח${amount} into account ${this.accountNumber}.`;
  }

  withdraw(amount) {
    if (amount > 0 && amount <= this.balance) {
      this.balance -= amount;
      BankAccount.totalMoney -= amount;
      const transaction = {
        type: "withdrawal",
        date: new Date(),
        amount: amount,
      };
      this.transactions.push(transaction);
      this.saveToLocalStorage(); // Save account data to local storage
      return `Successfully withdrew שח${amount} from account ${this.accountNumber}.`;
    } else {
      return "Insufficient funds or invalid amount for withdrawal.";
    }
  }

  getBalance() {
    return `Account ${this.accountNumber} balance: שח${this.balance}`;
  }

  saveToLocalStorage() {
    // Serialize account data and save to local storage
    const accountData = JSON.stringify({
      balance: this.balance,
      transactions: this.transactions,
    });
    localStorage.setItem(`bankAccount_${this.id}`, accountData);

    // Added by Hoshen - Bank Overview
    // After each action the bank total balance and total users are being saved in the local storage
    const bankData = JSON.stringify({
      bankBalance: BankAccount.totalMoney,
      bankTotalUsers: BankAccount.totalUsers,
    });
    localStorage.setItem(`bankData`, bankData);
  }

  static totalUsers = 0;
  static totalMoney = 0;

  static getTotalUsers() {
    return `Total users: ${BankAccount.totalUsers}`;
  }

  static getTotalMoney() {
    return `Total money in the bank: שח${BankAccount.totalMoney}`;
  }

  static createNewCustomer(firstName, lastName, id) {
    const existingCustomerData = localStorage.getItem("bankCustomers");
    let customers = existingCustomerData
      ? JSON.parse(existingCustomerData)
      : [];

    // Check if customer already exists
    const existingCustomer = customers.find((customer) => customer.id === id);
    if (existingCustomer) {
      return `${firstName} ${lastName} already exists as a customer.`;
    }

    // Create new customer
    const newCustomer = new BankAccount(firstName, lastName, id);
    customers.push(newCustomer);
    localStorage.setItem("bankCustomers", JSON.stringify(customers));

    // Added by Hoshen - Bank Overview
    // On creation of new user, updates bankData on local storage
    const bankData = JSON.stringify({
      bankBalance: BankAccount.totalMoney,
      bankTotalUsers: BankAccount.totalUsers,
    });
    localStorage.setItem(`bankData`, bankData);

    return `Customer ${firstName} ${lastName} created successfully.`;
  }

  // Added by Hoshen - Bank Overview
  // A function that creates ListItems based on the users stored in local storage
  static createCustomerList() {
    const users = localStorage.getItem("bankCustomers");
    const usersArr = JSON.parse(users);
    const userUL = document.querySelector("#customerList");
    usersArr.forEach((user) => {
      const userLI = document.createElement("li");
      // Feel free to change it in order to display different details
      userLI.textContent = `Account: ${user.accountNumber} | Name: ${user.firstName} ${user.lastName} |  Balance: ${user.balance}`;
      userUL.appendChild(userLI);
    });
  }
}

// Added by Hoshen - Bank Overview
// On DOM load retrieves bank data from local storage and updates the text
document.addEventListener("DOMContentLoaded", function () {
  let bankBalance_display = document.querySelector("#bankBalance");
  let bankTotalUsers_display = document.querySelector("#customerList");

  // IRRELEVANT CODE - FOR TESTING ONLY
  // Create new users for testing
  BankAccount.createNewCustomer("Hoshen", "Perez", 1234);
  BankAccount.createNewCustomer("Yogev", "Tuval", 4321);
  BankAccount.createNewCustomer("Kobi", "Perelmuter", 5623);
  BankAccount.createNewCustomer("Ron", "Oz", 3235);

  const bankData = localStorage.getItem("bankData");
  if (bankData) {
    const parsedBankData = JSON.parse(bankData);
    bankBalance_display.textContent = `${parsedBankData.bankBalance} NIS`;
    bankTotalUsers_display.textContent = ` The bank has ${parsedBankData.bankTotalUsers} total users`;
  } else {
    bankBalance_display.textContent = `0 NIS`;
    bankTotalUsers_display.textContent = `The bank has 0 users`;
  }

  // Retrieves users from local storage
  const testBankUsers = localStorage.getItem("bankCustomers");
  const parsedTestBankUsers = JSON.parse(testBankUsers);
  // Console log just to see what is being stored
  console.log(parsedTestBankUsers);
  // Activatin the function that creates the users List Items
  BankAccount.createCustomerList();
});
