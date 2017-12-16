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
    queryDatabase();
});

function queryDatabase() {
    // query the database for all items being auctioned
    connection.query("SELECT product_name, item_id, price FROM products", function (err, results) {
        if (err) throw err;
        // get the information of all items in the database
        for (var i = 0; i < results.length; i++) {
            // console.log("Product: " + results[i].product_name + ", ID: " + results[i].item_id + ", Price: " + results[i].price);
            // console.log("--------------------------------------------")
            products.push(results[i].product_name + "(" + results[i].item_id + ")");
        };
        runAnalytics();
        connection.end();
    });
};

var products = [];

function runAnalytics() {
    inquirer
        .prompt({
            name: "menuOptions",
            type: "list",
            message: "Select what stats you'd like to see.",
            choices: ["View Products for Sale", "View Low Inventory", "Add to Inventory", "Add New Product"],
        }).then(function (answer) {
            if (menuOptions.choices === "View Products for Sale") {
                console.log(products);
            } else {
                console.log("Nothing to see here")
            }
        });
}