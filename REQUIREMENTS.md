# API Requirements
The company stakeholders want to create an online storefront to showcase their great product ideas. Users need to be able to browse an index of all products, see the specifics of a single product, and add products to an order that they can view in a cart page. You have been tasked with building the API that will support this application, and your coworker is building the frontend.

These are the notes from a meeting with the frontend developer that describe what endpoints the API needs to supply, as well as data shapes the frontend and backend have agreed meet the requirements of the application. 

## API Endpoints
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

## Data Shapes
#### Product
- id SERIAL PRIMARY KEY,
- name VARCHAR(255) Not NULL UNIQUE,
- price NUMERIC Not NULL,
- category VARCHAR(255) DEFAULT '' "optional"

#### users
- id SERIAL PRIMARY KEY
- first_name VARCHAR(100) Not NULL
- last_name VARCHAR(100) Not NULL
- user_name VARCHAR(200) Not NULL UNIQUE "optional will be concatination of first and last name"
- role user_role NOT NULL Default 'user' [user_role: ENUM ('admin', 'user')] "optional"
- password VARCHAR(255) NOT NULL

#### Orders
- id SERIAL PRIMARY KEY,
- status order_status NOT NULL Default 'complete',[order_status: ENUM ('active', 'complete')]
- user_id BIGINT REFERENCES users(id)  NOT NULL


#### Orders
- id SERIAL PRIMARY KEY,
- quantity INTEGER Not NULL,
- product_id BIGINT REFERENCES products(id) Not NULL,
- order_id BIGINT REFERENCES orders(id) Not NULL

### Some Validations
- catch any error for all models` functions
- Show: valid id to select where, else we show not found
- Create: all parameters exist and also has a valid type, else we show missing parameters or invalid type, and also if we have enum    type we must not use any other data except enum data
- Update: all parameters exist and also has a valid type including a valid id, else we show missing parameters or invalid type, and also if we have enum    type we must not use any other data except enum data
- Delete: we check that id not used in another table, and also it is a valid id
- We restrict some create, update, and delete actions for admin user
- Foreign keys: we check that it is exist in its reference table, else we show id not found. 
- In orders we only accept one active(not complete) order for each user
- We chek before order creation, and updating that the token has the same user id of the order
- All endpoints require token validation except create user, and get token
