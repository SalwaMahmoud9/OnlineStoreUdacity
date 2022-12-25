import Client from '../database';

export type Product = {
  id?: number;
  name: string;
  price: number;
  category?: string;
};

export class ProductStore {
  // insert product
  async create(p: Product): Promise<Product> {
    try {
      const sql =
        'INSERT INTO products (name,price,category) VALUES($1, $2, $3) RETURNING *;';
      const conn = await Client.connect();

      const result = await conn.query(sql, [p.name, p.price, p.category]);

      const product = result.rows[0];

      conn.release();

      return product;
    } catch (err) {
      throw new Error(
        `Could not add new product ${p.name} . Error: ${(err as Error).message}`
      );
    }
  }

  // get product by id
  async show(id: number): Promise<Product> {
    try {
      const sql = 'SELECT * FROM products WHERE id=($1);';
      const conn = await Client.connect();

      const result = await conn.query(sql, [id]);

      conn.release();
      return result.rows[0];
    } catch (err) {
      throw new Error(
        `Could not find product ${id}. Error: ${(err as Error).message}`
      );
    }
  }

  // get all products
  async index(): Promise<Product[]> {
    try {
      const conn = await Client.connect();
      const sql = 'SELECT * FROM products;';
      const result = await conn.query(sql);
      conn.release();

      return result.rows;
    } catch (err) {
      throw new Error(
        `Could not get products. Error: ${(err as Error).message}`
      );
    }
  }

  // update product by id
  async update(p: Product): Promise<Product> {
    try {
      const sql =
        'UPDATE products SET  name=($2) , price=($3) , category=($4) WHERE id=($1) RETURNING *;';
      const conn = await Client.connect();

      const result = await conn.query(sql, [p.id, p.name, p.price, p.category]);

      const product = result.rows[0];

      conn.release();

      return product;
    } catch (err) {
      throw new Error(
        `Could not update  product ${p.name} . Error: ${(err as Error).message}`
      );
    }
  }

  // delete product by id
  async delete(id: number): Promise<number> {
    try {
      const sql = 'DELETE FROM products WHERE id=($1);';

      const conn = await Client.connect();

      const result = await conn.query(sql, [id]);
      const numberOfDeletedRows = result.rowCount;
      conn.release();

      return numberOfDeletedRows;
    } catch (err) {
      throw new Error(`Could not delete product ${id}. Error: ${err}`);
    }
  }
}
