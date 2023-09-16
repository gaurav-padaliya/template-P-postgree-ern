import Keystore from '../model/Keystore';
import { Database } from '..'; // Import your Database class

class KeystoreRepo {
  constructor(private readonly db: Database) {}

  async findForKey(clientId: number, key: string): Promise<Keystore | null> {
    const sql =
      'SELECT * FROM keystores WHERE client_id = $1 AND primaryKey = $2 AND status = true';
    const values = [clientId, key];

    try {
      const result = await this.db.query(sql, values);
      return result.rows[0] || null;
    } catch (error) {
      console.error('Error finding keystore for key:', error);
      return null;
    }
  }

  async remove(id: number): Promise<Keystore | null> {
    const sql = 'DELETE FROM keystores WHERE id = $1 RETURNING *';
    const values = [id];

    try {
      const result = await this.db.query(sql, values);
      return result.rows[0] || null;
    } catch (error) {
      console.error('Error removing keystore:', error);
      return null;
    }
  }

  async removeAllForClient(clientId: number): Promise<void> {
    const sql = 'DELETE FROM keystores WHERE client_id = $1';
    const values = [clientId];

    try {
      await this.db.query(sql, values);
    } catch (error) {
      console.error('Error removing all keystores for client:', error);
    }
  }

  async find(
    clientId: number,
    primaryKey: string,
    secondaryKey: string,
  ): Promise<Keystore | null> {
    const sql =
      'SELECT * FROM keystores WHERE client_id = $1 AND primaryKey = $2 AND secondaryKey = $3';
    const values = [clientId, primaryKey, secondaryKey];

    try {
      const result = await this.db.query(sql, values);
      return result.rows[0] || null;
    } catch (error) {
      console.error('Error finding keystore:', error);
      return null;
    }
  }

  async create(
    clientId: number,
    primaryKey: string,
    secondaryKey: string,
  ): Promise<Keystore | null> {
    const now = new Date();
    const sql = `
      INSERT INTO keystores (client_id, primaryKey, secondaryKey, status, createdAt, updatedAt)
      VALUES ($1, $2, $3, true, $4, $5)
      RETURNING *
    `;
    const values = [clientId, primaryKey, secondaryKey, now, now];

    try {
      const result = await this.db.query(sql, values);
      return result.rows[0] || null;
    } catch (error) {
      console.error('Error creating keystore:', error);
      return null;
    }
  }
}

export default KeystoreRepo;
