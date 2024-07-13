#! /usr/bin/env node
const { Command } = require("commander");
const program = new Command();
const fs = require("fs/promises");




// Create a budget CLI tool where you can:
// /Add a new expense./Delete an expense.
// /Show all expenses.
// /Use the fs module to save expense information.

async function readData(filepath, isObject = false) {
  try {
    const data = await fs.readFile(filepath, "utf-8")
    return isObject ? JSON.parse(data) : data;
  } catch (er) {
    console.log(er)
  }
}

async function writeData(filepath, file) {
  try {
    await fs.writeFile(filepath, JSON.stringify(file))
    console.log({ message: "Done" })
  } catch (er) {
    console.log(er)
  }
}


program
  .command("create")
  .argument("<balance>")
  .action(async (balance) => {
    const budgetInfo = [];
    const info = { balance: Number(balance), expenses: [] }
    budgetInfo.push(info)
    await writeData("budget.json", budgetInfo)
  });

  program
  .command("expense")
  .argument("<amount>")
  .argument("<type>")
  .action(async (amount, type) => {
    const data = await readData("budget.json", true)

    const currentBudget = data[0]
    const expenseAmount = Number(amount);

    if (currentBudget.balance >= expenseAmount) {
      currentBudget.balance -= expenseAmount;
      currentBudget.expenses.push({ expense: expenseAmount, type: type })

      const updatedBudget = {
        balance: currentBudget.balance,
        expenses: currentBudget.expenses,
      };
      await writeData("budget.json", [updatedBudget])
      console.log(updatedBudget)
    } else {
      console.log("Insufficient balance");
    }
  });

program
  .command("delete")
  .argument("name")
  .action(async (name) => {
    const data = await readData("budget.json", true)
    const currentBudget = data[0];
    const index = currentBudget.expenses.findIndex((el) => el.type === name)
    if (index === -1) {
      throw new Error({ message: "Expense not found" })
    }
    const deletedExpense = currentBudget.expenses.splice(index, 1)
    await writeData("budget.json", [currentBudget]);
    console.log({ message: "Done", deletedExpence: deletedExpense })
  });

program.command("getBudget").action(async () => {
  const data = await readData("budget.json")
  console.log(data)
});

program.parse()
