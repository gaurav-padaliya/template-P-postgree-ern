import Role from '../model/Role';
import { Database } from '..'; // Import your Database class

class RoleRepo {
  constructor(private readonly db: Database) {}

  static async findByCode(code: string): Promise<Role | null> {
    const db = new Database();
    const sql = 'SELECT * FROM roles WHERE code = $1 AND status = true';
    const values = [code];

    try {
      const result = await db.query(sql, values);
      return result.rows[0] || null;
    } catch (error) {
      console.error('Error finding role by code:', error);
      return null;
    }
  }

  static async findByCodes(codes: string[]): Promise<Role[]> {
    const db = new Database();
    const sql = 'SELECT * FROM roles WHERE code = ANY($1) AND status = true';
    const values = [codes];

    try {
      const result = await db.query(sql, values);
      return result.rows;
    } catch (error) {
      console.error('Error finding roles by codes:', error);
      return [];
    }
  }
}

export default RoleRepo;
