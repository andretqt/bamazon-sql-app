var mysql = require('mysql');
var inquirer = require('inquirer');
var consoleTable = require('console.table');
var connection = mysql.createConnection({
    user: 'root',
    password: 'motdepasse',
    host: 'localhost',
    port: 3306,
    database: 'bamazonDB'
});

inquirer.prompt([{
    name: 'choice',
    message: 'These are your options:\n1. View Product Sales by Department\n2. Create New Department\nEnter number of action you would like to proceed with: '
}]).then(function(answer){
    answer.choice = Number(answer.choice);
    if (answer.choice === 1) {
        console.log('first option');
        /// have to have a query that creates an alias for total_profits
        connection.query(`SELECT  department_id, department_name, over_head_costs, product_sales,
                        (SUM(product_sales)-SUM(over_head_costs)) AS total_profit 
                        FROM departments
                        GROUP BY department_id, department_name, over_head_costs, product_sales;`, function(err, res){
            if (err) throw err;
            console.log(consoleTable.getTable(res));
            connection.end();
        });
    } else if (answer.choice ===2) {
        console.log('second option')
        inquirer.prompt([{
            message:'What is the new department name?',
            name: 'name'
        },
        { 
            message: 'Please provide estimate of over head costs.',
            name:'cost'
        }]).then(function(answer){
            connection.query(`INSERT INTO departments (department_name, over_head_costs, product_sales) 
                            VALUES ('${answer.name.toUpperCase()}', ${Number(answer.cost)}, 0)`, function(err) {
                if (err) throw err;
                console.log('The department has been added to our database');
                connection.end();
            });
        });
    } else {
        console.log('Enter a valid number please')
    }
});