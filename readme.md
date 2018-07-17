bamazonustomer.js is a node js application that reflects access the content of a Store inventory. The store inventory is a sql table inside a database. These are the columns of said table: item_id, product_name, department_name, price, stock_quanity. The table is filled with mock data.
The app does two things:
1) shows to the user (via the console) what's in store.
2) takes input from user (item_id and units to be purchased), then using the input, the total amount due by the user is logged in the console, and the stock quantity if the item is updated in the products table.

Improvements needed: 
due to the asynchronous nature of the javascript language, user prompt is logged at the same time as the products table. Ideally the table should be shown first, then prompt the user.

bamazonManager.js and bamazonSupervisor.js are two other applications that allow more data manipulation (user can add to inventory, order a new product, create a new department). Basic finances are calculated and updated automatically. 
