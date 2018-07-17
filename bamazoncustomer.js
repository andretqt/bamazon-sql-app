//loading ==== our === packages
var mysql = require('mysql');
var inquirer = require('inquirer');
var consoleTable = require('console.table');

// console.log(inquirer); // a way to check what's in the inquirer pkg (methods and properties)
//========

var connection = mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: 'motdepasse',
    database: 'bamazonDB'
});
//i wanna display what we got in store before promp
connection.connect(function(err, res){
    //1=====================
    if (err) throw err;
    connection.query('SELECT item_id, product_name, price FROM products', function(err, res) {
        if (err) throw err;
        //work on displaying answer more meaningfully
        console.log(consoleTable.getTable(res));
    })
    //2======================
    //when customer starts his command
    inquirer.prompt([{
        name: "id",
        message: "item id pls "
    }, {
        name: "units",
        message: "how many units pls "

    }]).then(function(answer){
        //command has been passed in by this point. Now we process the command
        var id = answer.id;
        var units = answer.units;
        connection.query(`SELECT * FROM products WHERE item_id = '${id}'`,function(error, qres){
            if (error) throw error; 
            if (units > qres[0].stock_quantity){
                console.log('Insufficient quantity!')
                connection.end();
            } else {
                var purchaseTotal = units * qres[0].price;
                console.log('Your purchase total adds up to $'+ purchaseTotal + ' dollars.');
                //update the products table
                //Luckily there's an UPDATE command in mysql
                //also UPDATE product_sales column in departments table
                var firstUpdateQuery = `UPDATE products SET stock_quantity = stock_quantity - ${units}, product_sales = product_sales + ${purchaseTotal} WHERE item_id = ${id}`;
                var secondUpdateQuery = `UPDATE bamazonDB.departments SET product_sales = product_sales + ${purchaseTotal} WHERE department_name = '${qres[0].department_name}'`;
                connection.query(firstUpdateQuery, function(error, ures) {
                    if (error) throw error;
                    connection.query(secondUpdateQuery, function(err, ures){
                        if (err) throw err;
                        connection.end();
                    });
                });
            }
        })
    });

});
///our code works for the basic commands
//user has to pick an id and also a quantity 
