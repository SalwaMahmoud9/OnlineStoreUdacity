#Main function 
===============
the project main functionality is to make a Storefront Backen projetc
##########################################################    
#Usage of API
==============
#### Products
- Index [token required] [GET]  /products
- Show [token required] [GET]  /products/:id
- Create [token required] [POST] /products (body: name, price, category)
- Delete [token, and admin user required] [DELETE] /products/:id
- Update [token, and admin user required] [PATCH] /products/:id (body: name, price, category)
- Top 5 most popular products [token required] [GET]  /mostPopularProducts
- Products by category [token required] [GET]  /productsByCategory/:category
- Products in orders [token required] [GET]  /productsInOrders

#### Users
- Index [token required] [GET]  /users
- Show [token required] [GET]  /users/:id
- Create [token not required] [POST] /users (body: first_name, last_name, user_name, role, password)
- Delete [token, and admin user required] [DELETE] /users/:id
- Update [token, and admin user required] [PATCH] /users/:id (body: first_name, last_name, user_name, role, password)
- Get token[send "username" and "password" as a json data in body] [POST] /users/login
- 5 most recent purchases orders for users [token required] [GET]  /mostRecentPurchases/:id 

#### Orders
- Index [token required] [GET]  /orders
- Show [token required] [GET]  /orders/:id
- Create [token required] [POST] /orders (body: status, user_id)
- Delete [token, and admin user required] [DELETE] /orders/:id
- Update [token, and admin user required] [PATCH] /orders/:id (body: status, user_id)
- Current Order by user [token required] [GET]  /ordersCurrentOrder/:id
- Completed Orders by user [token required] [GET]  /ordersCompletedOrders/:id
- Add products in Order [token required send "product_id" and "quantity" as a json data in body] [GET] /orders/:id/products (body: quantity, product_id, order_id)



##########################################################
#Technologies Used
===================
Your application must make use of the following libraries:
- Postgres for the database
- Node/Express for the application logic
- dotenv from npm for managing environment variables
- db-migrate from npm for migrations
- jsonwebtoken from npm for working with JWTs
- jasmine from npm for testing

I have written some scripts that needs to be run
scripts
    "testJasmine": "cross-env ENV=test jasmine"
    "devJasmine": "jasmine"
    "testdb-reset": "db-migrate reset --config ./database.json --e test"
    "testdb-up": "db-migrate --config ./database.json --e test up"
    "devdb-up": "db-migrate up --config ./database.json --e dev"
    "devdb-reset": "db-migrate reset --config ./database.json --e dev" 
    "build": "npx tsc"
    "lint": "eslint . --ext .ts"
    "prettier": "prettier --config .prettierrc src/**/*.ts --write"
    "start": "nodemon src/server.ts"
    "watch": "tsc-watch --esModuleInterop src/server.ts --outDir ./dist --onSuccess \"node ./dist/server.js\""
    "test": "db-migrate reset --config ./database.json --e test && set NODE_ENV=test&& npm run build && npm run testdb-up && jasmine"
  
***********************************************************************
I have used some dependencies
"devDependencies": 
    npm i --save-dev @types/bcrypt@5.0.0
    npm i --save-dev @types/cors@2.8.12
    npm i --save-dev @types/dotenv@8.2.0
    npm i --save-dev @types/express@4.17.13
    npm i --save-dev @types/jasmine@3.6.3
    npm i --save-dev @types/jsonwebtoken@8.5.5
    npm i --save-dev @types/node@18.0.6
    npm i --save-dev @types/pg@8.6.5
    npm i --save-dev @types/supertest@2.0.12
    npm i --save-dev @typescript-eslint/eslint-plugin@5.30.7
    npm i --save-dev @typescript-eslint/parser@5.30.7
    npm i --save-dev eslint@7.12.1
    npm i --save-dev eslint-config-prettier@6.15.0
    npm i --save-dev eslint-plugin-prettier@3.4.1
    npm i --save-dev get-element@0.1.1
    npm i --save-dev jasmine@3.6.4
    npm i --save-dev jasmine-spec-reporter@6.0.0
    npm i --save-dev nodemon@2.0.19
    npm i --save-dev prettier@2.7.1
    npm i --save-dev ts-node@10.9.1 
    npm i --save-dev tsc-watch@4.2.9
    npm i --save-dev typescript@4.7.4

"dependencies":
    npm i bcrypt@5.0.1
    npm i body-parser@1.19.0
    npm i cors@2.8.5
    npm i cross-env@7.0.3
    npm i db-migrate@0.11.13
    npm i db-migrate-pg@1.2.2
    npm i dotenv@16.0.1
    npm i express@4.18.1
    npm i jsonwebtoken@8.5.1
    npm i jwt-decode@3.1.2
    npm i pg@8.5.1
    npm i supertest@6.2.4
 
##########################################################
#Tests
==========
-Test cases have been added for all functions and endpoints you can run it by:
    -reset migrations first [test database: testdb-reset, and dev database: devdb-reset]
    -run all migrations up [test database: testdb-up, and dev database: devdb-up]
    -run jasmine test [test database: testJasmine, and dev database: devJasmine]
##########################################################
#How it works
=============
-First step you should Create databases you can create one for development and the other for test, you can do this by pgadmin or by command line
-Please add all psql data in .env file (POSTGRES_DB, POSTGRES_TEST_DB, POSTGRES_USER, POSTGRES_PASSWORD)
-NODE_ENV=dev for dev database, and NODE_ENV=test for test database
-To use password hashing, and token authontication change your security data in .env file (BCRYPT_PASSWORD, SALT_ROUNDS, TOKEN_SECRET)
-To add all tables in the created database you need to run all migrations up files [test database: testdb-reset, and dev database: devdb-reset]
-Our used port is 3000
-Database port number is the Default port 5432
-Then you can use any endpoint as described to perform an action on the tables for examples:
    -http://127.0.0.1:3000/users/login  [POST] (body: "username" and "password") to get token
    -CREATE(POST) Or UPDATE(PATCH): for update we will add /:id to update one element data by the added id 
        -http://127.0.0.1:3000/users  [POST/PATCH] (body: "first_name", "last_name", "user_name", "role", and "password")
        -http://127.0.0.1:3000/orders  [POST/PATCH] (body: "status" and "user_id")
        -http://127.0.0.1:3000/products  [POST/PATCH] (body: "name", "price" and "category")
        -http://127.0.0.1:3000/orders/:id/products  [POST] (body: "quantity", and "product_id") and send order id in the url
    -INDEX Or SHOW: it will get all data in the table, and you can add /:id to show one element data by the added id 
        -http://127.0.0.1:3000/users  [GET] 
        -http://127.0.0.1:3000/orders  [GET] 
        -http://127.0.0.1:3000/products  [GET] 
        -http://127.0.0.1:3000/ordersCurrentOrder/:id [GET] Current Order by user
    -DELETE: 
        -http://127.0.0.1:3000/users/:id  [DELETE] 
        -http://127.0.0.1:3000/orders/:id  [DELETE] 
        -http://127.0.0.1:3000/products/:id  [DELETE]    


##########################################################
#extra
=============
-add all CRUD
-http://127.0.0.1:3000/ordersCompletedOrders/:id [GET] Completed Orders by user
-http://127.0.0.1:3000/mostPopularProducts [GET] Top 5 most popular products
-http://127.0.0.1:3000/productsByCategory/:category [GET] Products by category
-http://127.0.0.1:3000/productsInOrders [GET] Products in orders
-http://127.0.0.1:3000/mostRecentPurchases/:id [GET] 5 most recent purchases orders for users

##########################################################
#commands to run
================
npm run build
npm run prettier
npm run lint 
npm run test
npm run start
npm run watch
##########################################################