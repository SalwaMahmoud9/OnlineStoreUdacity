import Client from '../database';

export class DashboardQueries {
  // Get all products that have been included in orders
  async productsInOrders(): Promise<
    { name: string; price: number; order_id: string }[]
  > {
    try {
      const conn = await Client.connect();
      const sql =
        'SELECT name, price, order_id FROM products INNER JOIN order_products ON products.id = order_products.product_id;';

      const result = await conn.query(sql);

      conn.release();

      return result.rows;
    } catch (err) {
      throw new Error(`unable get products and orders: ${err}`);
    }
  }

  // - [OPTIONAL] Top 5 most popular products
  async mostPopularProducts(): Promise<{ name: string; qty: number }[]> {
    try {
      const conn = await Client.connect();
      const sql =
        'SELECT name, count(quantity) AS qty FROM products FULL OUTER JOIN order_products ON products.id = order_products.product_id GROUP BY name ORDER BY qty DESC  LIMIT 5;';

      const result = await conn.query(sql);

      conn.release();

      return result.rows;
    } catch (err) {
      throw new Error(`unable get most popular products: ${err}`);
    }
  }

  // - [OPTIONAL] Products by category (args: product category)
  async productsByCategory(category: string): Promise<{ name: string }[]> {
    try {
      const conn = await Client.connect();
      const sql =
        "SELECT name FROM products WHERE category='" + category + "';";

      const result = await conn.query(sql);

      conn.release();

      return result.rows;
    } catch (err) {
      throw new Error(`unable get products: ${err}`);
    }
  }

  // - Current Order by user (args: user id)[token required]
  async currentOrder(
    user_id: number
  ): Promise<{ name: string; quantity: number; order_id: number }[]> {
    try {
      const conn = await Client.connect();
      const sql =
        (('SELECT name,quantity,order_id FROM products INNER JOIN order_products ON products.id = order_products.product_id INNER JOIN orders ON orders.id = order_products.order_id where user_id=' +
          user_id) as string) + " and status='active';";

      const result = await conn.query(sql);

      conn.release();

      return result.rows;
    } catch (err) {
      throw new Error(`unable get products: ${err}`);
    }
  }

  // - [OPTIONAL] Completed Orders by user (args: user id)[token required]
  async completedOrders(
    user_id: number
  ): Promise<{ name: string; quantity: number; order_id: number }[]> {
    try {
      const conn = await Client.connect();
      const sql =
        (('SELECT name,quantity,order_id FROM products INNER JOIN order_products ON products.id = order_products.product_id INNER JOIN orders ON orders.id = order_products.order_id where user_id=' +
          user_id) as string) + " and status='complete';";

      const result = await conn.query(sql);

      conn.release();

      return result.rows;
    } catch (err) {
      throw new Error(`unable get products: ${err}`);
    }
  }

  // -Add a users 5 most recent purchases to the data being sent back from the user show endpoint (/users/id)
  async mostRecentPurchases(
    user_id: number
  ): Promise<{ total: number; order_id: number }[]> {
    try {
      const conn = await Client.connect();
      const sql =
        (('SELECT SUM(p.price * op.quantity) ,order_id FROM  products as p JOIN order_products as op on op.product_id= p.id WHERE op.order_id in (SELECT id FROM ORDERS WHERE user_id=' +
          user_id) as string) + ' ORDER BY id DESC LIMIT 5) GROUP BY order_id;';

      const result = await conn.query(sql);

      conn.release();

      return result.rows;
    } catch (err) {
      throw new Error(`unable get most recent purchases: ${err}`);
    }
  }
}
