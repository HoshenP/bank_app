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

  //tcccc

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

    return `Customer ${firstName} ${lastName} created successfully.`;
  }
}
