// @ts-ignore
import client from '../database';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';

dotenv.config();

const { SALT_ROUNDS, BCRYPT_PASSWORD } = process.env;

export type User = {
  id: number;
  firstName: string;
  lastName: string;
  password: string;
};

export class Users {
  async index(): Promise<User[]> {
    try {
      // @ts-ignore
      const conn = await client.connect();
      const sql = 'SELECT * FROM users';

      const result = await conn.query(sql);

      conn.release();

      return result.rows;
    } catch (err) {
      throw new Error(`Could not get users. Error: ${err}`);
    }
  }

  async show(id: string): Promise<User> {
    try {
      const sql = 'SELECT * FROM users WHERE id=($1)';
      // @ts-ignore
      const conn = await client.connect();

      const result = await conn.query(sql, [id]);

      conn.release();

      return result.rows[0];
    } catch (err) {
      throw new Error(`Could not find user ${id}. Error: ${err}`);
    }
  }

  async create(b: User): Promise<User> {
    try {
      const sql =
        'INSERT INTO users (firstName, lastName, password) VALUES($1, $2, $3) RETURNING *';
      // @ts-ignore
      const conn = await client.connect();
      const hash = bcrypt.hashSync(
        b.password + BCRYPT_PASSWORD,
        //@ts-ignore
        parseInt(SALT_ROUNDS)
      );
      const result = await conn.query(sql, [b.firstName, b.lastName, hash]);

      const user = result.rows[0];

      conn.release();

      return user;
    } catch (err) {
      throw new Error(`Could not add new user ${b.firstName}. Error: ${err}`);
    }
  }

  async delete(id: string): Promise<User> {
    try {
      const sql = 'DELETE FROM users WHERE id=($1)';
      // @ts-ignore
      const conn = await client.connect();

      const result = await conn.query(sql, [id]);

      const user = result.rows[0];

      conn.release();

      return user;
    } catch (err) {
      throw new Error(`Could not delete user ${id}. Error: ${err}`);
    }
  }
  async authenticate(
    firstName: string,
    password: string
  ): Promise<User | null> {
    //@ts-ignore
    const conn = await client.connect();
    const sql = 'SELECT * FROM users WHERE firstName=($1)';
    const result = await conn.query(sql, [firstName]);
    if (result.rows.length) {
      const user = result.rows[0];
      console.log(password + BCRYPT_PASSWORD);
      console.log(
        bcrypt.compareSync(password + BCRYPT_PASSWORD, user.password)
      );
      console.log(user.password);
      if (bcrypt.compareSync(password + BCRYPT_PASSWORD, user.password)) {
        return user;
      }
    }
    return null;
  }
}
