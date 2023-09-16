import { Pool, PoolClient, QueryResult } from 'pg';
import { db } from '../config'; // Make sure you have a config file with your database credentials

export class Database {
  private pool: Pool;

  constructor() {
    this.pool = new Pool({
      user: db.dev.DB_USERNAME,
      host: db.dev.DB_HOST,
      database: db.dev.DB_DATABASE,
      password: db.dev.DB_PASSWORD,
      port: db.dev.DB_PORT,
    });
  }

  async query(sql: string, args: any[] = []): Promise<QueryResult> {
    const client: PoolClient = await this.pool.connect();
    try {
      const result = await client.query(sql, args);
      return result;
    } finally {
      client.release();
    }
  }

  async shouldAbort(err: Error): Promise<boolean> {
    const client: PoolClient = await this.pool.connect();
    try {
      await client.query('ROLLBACK');
      return true;
    } catch (rollbackErr) {
      // Handle the rollback error if needed
      console.error('Error during rollback:', rollbackErr);
      return false;
    } finally {
      client.release();
    }
  }
}
