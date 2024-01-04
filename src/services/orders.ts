//@ts-ignore
import client from '../database';

export class Orders {
  // Get all products that have been included in orders
  async productsInOrders(): Promise<
    {
      status: string;
      quantity: number;
      author: string;
      order_id: string;
    }[]
  > {
    try {
      //@ts-ignore
      const conn = await client.connect();
      const sql =
        'SELECT title, total_pages, author, order_id FROM orders INNER JOIN order_products ON orders.id = order_products.id WHERE order.id = 2';
      const result = await conn.query(sql);

      conn.release();
      return result.rows;
    } catch (err) {
      throw new Error(`unable get books and orders: ${err}`);
    }
  }
  ///////////

  // Get all users that have made orders
  async usersWithOrders(): Promise<{ firstName: string; lastName: string }[]> {
    try {
      //@ts-ignore
      const conn = await client.connect();
      const sql =
        'SELECT username FROM users INNER JOIN orders ON users.id = orders.user_id';

      const result = await conn.query(sql);

      conn.release();

      return result.rows;
    } catch (err) {
      throw new Error(`unable get users with orders: ${err}`);
    }
  }
  async fiveMostExpensive(): Promise<{ name: string; price: number }[]> {
    try {
      //@ts-ignore
      const conn = await client.connect();
      const sql =
        'SELECT name, price FROM products ORDER BY price DESC LIMIT 5';
      const result = await conn.query(sql);
      conn.release();
      return result.rows;
    } catch (err) {
      throw new Error(`unable get products by price: ${err}`);
    }
  }
}
