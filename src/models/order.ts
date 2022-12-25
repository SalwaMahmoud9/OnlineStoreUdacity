import Client from '../database';

export type Order = {
  id?: number;
  status: string;
  user_id: number;
};
export type OrderProduct = {
  id?: number;
  quantity: number;
  product_id: number;
  order_id: number;
};
export class OrderStore {
  // add order
  async create(o: Order): Promise<Order> {
    try {
      const sql =
        'INSERT INTO orders (status,user_id) VALUES($1, $2) RETURNING *;';
      const conn = await Client.connect();

      const result = await conn.query(sql, [o.status, o.user_id]);

      const order = result.rows[0];

      conn.release();

      return order;
    } catch (err) {
      throw new Error(
        `Could not add new order ${o.status} . Error: ${(err as Error).message}`
      );
    }
  }

  // select order by id
  async show(id: number): Promise<Order> {
    try {
      const sql = 'SELECT * FROM orders WHERE id=($1);';
      const conn = await Client.connect();

      const result = await conn.query(sql, [id]);

      conn.release();
      return result.rows[0];
    } catch (err) {
      throw new Error(
        `Could not find order ${id}. Error: ${(err as Error).message}`
      );
    }
  }

  // select all orders
  async index(): Promise<Order[]> {
    try {
      const conn = await Client.connect();
      const sql = 'SELECT * FROM orders;';
      const result = await conn.query(sql);
      conn.release();

      return result.rows;
    } catch (err) {
      throw new Error(`Could not get orders. Error: ${(err as Error).message}`);
    }
  }

  // update order by id
  async update(o: Order): Promise<Order> {
    try {
      const sql =
        'UPDATE orders SET status=($2) , user_id=($3) WHERE id=($1) RETURNING *;';
      const conn = await Client.connect();

      const result = await conn.query(sql, [o.id, o.status, o.user_id]);

      const order = result.rows[0];

      conn.release();

      return order;
    } catch (err) {
      throw new Error(
        `Could not update  order ${o.status} . Error: ${(err as Error).message}`
      );
    }
  }

  // delete order by id
  async delete(id: number): Promise<number> {
    try {
      const sql = 'DELETE FROM orders WHERE id=($1);';

      const conn = await Client.connect();

      const result = await conn.query(sql, [id]);
      const numberOfDeletedRows = result.rowCount;
      conn.release();

      return numberOfDeletedRows;
    } catch (err) {
      throw new Error(`Could not delete order ${id}. Error: ${err}`);
    }
  }

  async addProduct(
    quantity: number,
    order_id: number,
    product_id: number
  ): Promise<OrderProduct> {
    try {
      const sql =
        'INSERT INTO order_products (quantity, order_id, product_id) VALUES($1, $2, $3) RETURNING *';
      const conn = await Client.connect();

      const result = await conn.query(sql, [quantity, order_id, product_id]);

      const order: OrderProduct = result.rows[0];

      conn.release();

      return order;
    } catch (err) {
      throw new Error(
        `Could not add product ${product_id} to order ${order_id}: ${err}`
      );
    }
  }

  // get all orders by id where active status we allow adding one active user only
  async showOrderStatus(user_id: number, id?: number): Promise<number> {
    try {
      let extraCondition: string;
      extraCondition = '';
      if (id != undefined) {
        extraCondition = ' and id!=' + id;
      }

      const sql =
        "SELECT * FROM orders WHERE user_id=($1) and status='active'" +
        extraCondition +
        ';';
      const conn = await Client.connect();

      const result = await conn.query(sql, [user_id]);
      const numberOfDeletedRows = result.rowCount;
      conn.release();
      return numberOfDeletedRows;
    } catch (err) {
      throw new Error(
        `Could not find order by user ${user_id}. Error: ${
          (err as Error).message
        }`
      );
    }
  }

  // get all order_products by order id
  async showOrder(order_id: number): Promise<OrderProduct> {
    try {
      const sql = 'SELECT * FROM order_products WHERE order_id=($1);';
      const conn = await Client.connect();

      const result = await conn.query(sql, [order_id]);

      conn.release();
      return result.rows[0];
    } catch (err) {
      throw new Error(
        `Could not find order ${order_id}. Error: ${(err as Error).message}`
      );
    }
  }

  // get all order_products by product id
  async showProduct(order_id: number): Promise<OrderProduct> {
    try {
      const sql = 'SELECT * FROM order_products WHERE product_id=($1);';
      const conn = await Client.connect();

      const result = await conn.query(sql, [order_id]);

      conn.release();
      return result.rows[0];
    } catch (err) {
      throw new Error(
        `Could not find order ${order_id}. Error: ${(err as Error).message}`
      );
    }
  }

  // get all orders by user id
  async showUser(order_id: number): Promise<OrderProduct> {
    try {
      const sql = 'SELECT * FROM orders WHERE user_id=($1);';
      const conn = await Client.connect();

      const result = await conn.query(sql, [order_id]);

      conn.release();
      return result.rows[0];
    } catch (err) {
      throw new Error(
        `Could not find order ${order_id}. Error: ${(err as Error).message}`
      );
    }
  }
}
