import ApiKey from '../model/ApiKey';
import { Database } from '..'; // Import your Database class

class ApiKeyRepo{
  constructor(private readonly db: Database) {}

  async findByKey(key: string): Promise<ApiKey | null> {
    const sql = 'SELECT * FROM api_keys WHERE key = $1 AND status = true';
    const values = [key];

    try {
      const result = await this.db.query(sql, values);
      return result.rows[0] || null;
    } catch (error) {
      console.error('Error finding API key by key:', error);
      return null;
    }
  }

  // Add other methods as needed
}

export default ApiKeyRepo;
