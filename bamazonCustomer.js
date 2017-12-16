var mysql = require("mysql");
var inquirer = require("inquirer");

var connection = mysql.createConnection({
  host: "localhost",
  port: 3306,

  // Your username
  user: "root",

  // Your password
  password: "",
  database: "bamazon"
});

connection.connect(function (err) {
  if (err) throw err;
  runCustomerQuestion();
});

function runCustomerQuestion() {
  // query the database for all items for sale
  connection.query("SELECT product_name, item_id, price, stock_quantity FROM products", function (err, results) {
    if (err) throw err;
    // get the information of all items in the database
    var productInfo = [];
    for (var i = 0; i < results.length; i++) {
        productInfo.push("Product: " + results[i].product_name + ", ID: " + results[i].item_id + ", Price: " + results[i].price);
         console.log(productInfo);
        // console.log("--------------------------------------------")
    };
    // once you have the items, prompt the user for which they'd like to bid on
    inquirer
      .prompt([{
          name: "choice",
          type: "rawlist",
          choices: function () {
            var products = [];
            for (var i = 0; i < results.length; i++) {
              products.push("Product: " + results[i].product_name + ", ID: " + results[i].item_id + ", Price: " + results[i].price + ", Quantity: " + results[i].stock_quantity);
            }
            return products;
          },
          message: "Select which product you'd like to purchase."
        },
        {
          name: "total",
          type: "input",
          message: "How many of these would you like to buy?"
        }
      ]).then(function (answer) {
        // get the information of the chosen item
        console.log(answer);
        var chosenItem = answer.choice;
        var itemTotal = answer.total;

        // determine if bid was high enough
        if (itemTotal <= chosenItem.stock_quantity) {
          // bid was high enough, so update db, let the user know, and start over
          connection.query(
            "UPDATE products SET ? WHERE ?", [{
                stock_quantity: (stock_quantity-itemTotal)
              },
              {
                id: chosenItem.id
              }
            ],
            function (error) {
              if (error) throw err;
              console.log("Your total comes to: " + (itemTotal*chosenItem.price));
            }
          );
        } else {
          // bid wasn't high enough, so apologize and start over
          console.log("Insufficient Quantity!");
        }
      });
  });
}