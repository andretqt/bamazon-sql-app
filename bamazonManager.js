var mysql = require('mysql');
var inquirer = require('inquirer');
var consoleTable = require('console.table');
//connect to our DB
var connection = mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: 'motdepasse',
    database: 'bamazonDB'
});

inquirer.prompt([{
    message: 'These are your options:\n1. View Products for Sale\n2. View Low Inventory\n3. Add to Inventory\n4. Add New Product\nEnter number of action you would like to proceed with: ',
    name: 'choice'
}]).then(function(answer){
    if (answer.choice === '1') {
        var queryOne = `SELECT item_id, product_name, price, stock_quantity FROM products`;
        connection.query(queryOne, function(err, res){
            if (err) throw err;
            console.log(consoleTable.getTable(res));
            connection.end();
            
        });
    } else if (answer.choice === '2') {
        //display item with a stock quantity less than 5
        var queryTwo = `SELECT * FROM products WHERE stock_quantity < 5`;
        connection.query(queryTwo, function(err, res){
            res.forEach(row => {
                var rowDisplay = `id: ${row.item_id} | name: ${row.product_name} | price: ${row.price} | quantity: ${row.stock_quantity}`;
                console.log(rowDisplay);
            });
            connection.end();
        });
    } else if (answer.choice === '4') {
        departmentNames = [];
        console.log('You have to specify your item details');
        connection.query(`SELECT COUNT (item_id) FROM products`,function(err, res){
            if (err) throw err;
            var myString = JSON.stringify(res[0])
            dbLength = myString.replace(/[^0-9]/g,'')
        });
        inquirer.prompt([{
                message: 'What is the product name?',
                name: 'prodname'
            },
            {
                message: `Please specify the department name.`,
                name: 'depname'
            },
            {
                message: `What's the price?`,
                name: 'price'
            },
            {
                message: `How many units do you want to order?`,
                name: 'quantity'
            }]).then(function(answer) {
                //pretreat answers before passing them
                dbLength = Number(dbLength);
                answer.prodname = answer.prodname.toUpperCase();
                answer.depname = answer.depname.toUpperCase();
                answer.price = Number(answer.price);
                answer.quantity = Number(answer.quantity);
                connection.query(`SELECT department_name FROM departments`, function(err, res){
                    if (err) throw err;
                    // console.log(["Sam", "Great", "Sample", "High"].includes("Sam")); // true
                    res.forEach(row => {
                        departmentNames.push(row.department_name);
                    });
                    if (departmentNames.includes(answer.depname) === true) {
                        var productQuery = `INSERT INTO products (item_id, product_name, department_name, price, stock_quantity, product_sales) VALUES(${Number(dbLength) + 1}, '${answer.prodname}', '${answer.depname}', ${answer.price}, ${answer.quantity}, 0)`;
                        connection.query(productQuery, function(err, res) {
                            if (err) throw err;
                            console.log('Product added to the store.')
                            connection.end();
                        })
                    } else {
                        console.log('That department does not exist yet. Please find our departments below and then proceed again.\n');
                        console.log('EXISTING DEPARTMENTS:\n')
                        departmentNames.forEach(category => {
                            console.log(category);
                        });
                        connection.end();
                    };
                });
            });
    } else if (answer.choice === '3') {
        //add more of an item to the store
        inquirer.prompt([{
            message: 'Enter the id of the item you wish to increase stock quantity',
            name: 'id_'
        },
        {
            message: 'How many more units should we order',
            name: 'units'
        }]).then(function(answer){
            answer.id_ = Number(answer.id_);
            answer.units = Number(answer.units);            
            connection.query(`UPDATE products SET stock_quantity = stock_quantity + ${answer.units} WHERE item_id = ${answer.id_}`, function(err, res) {
                if (err) throw err;
                console.log('Item added to inventory');
            });
            connection.end();
        });
        
    } else {
        console.log('Choose a valid number please');
    }
});

