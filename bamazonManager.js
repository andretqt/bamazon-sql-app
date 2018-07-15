var mysql = require('mysql');
var inquirer = require('inquirer');
//connect to our DB
var connection = mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: 'motdepasse',
    database: 'bamazonDB'
});
//first we gotta display what options the user got
inquirer.prompt([{
    message: 'These are your options:\n1. View Products for Sale\n2. View Low Inventory\n3. Add to Inventory\n4.Add New Product\nEnter number of action you would like to proceed with',
    name: 'choice'
}]).then(function(answer){
    console.log(answer.choice);
    switch(answer.choice) {
        
    };
});

