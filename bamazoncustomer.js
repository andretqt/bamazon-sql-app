//loading ==== our === packages
var mysql = require('mysql');
var inquirer = require('inquirer');
// console.log(inquirer); // a way to check what's in the inquirer pkg (methods and properties)
//========

var connection = mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: 'motdepasse',
    database: 'bamazonDB'
});

connection.connect(function(err, res){
    if (err) throw err;
    connection.query('SELECT item_id, product_name, price FROM products', function(err, res) {
        if (err) throw err;
        //work on displaying answer more meaningfully
        res.forEach(row => {
            var rowDisplay = (`id: ${row.item_id} name: ${row.product_name} price: ${row.price}`);
            // console.log(rowDisplay);
        });
    })
 
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
                console.log('Insuficient quantity!')
            } else {
                console.log(units * qres[0].price);
                //update the products table
                //Luckily there's an UPDATE command in mysql
                updateQuery = `UPDATE products SET stock_quantity = stock_quantity - ${units} WHERE item_id = ${id}`
                connection.query(updateQuery, function(error, ures) {
                    if (error) throw error;
                    connection.end();
                });
            }
        })
    });

});
///our shit works
//user has to pick an id and also a quantity 
