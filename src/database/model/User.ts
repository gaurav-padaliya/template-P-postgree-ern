import { QueryResult } from 'pg';
import { Database } from '..';
import Role from './Role';
export interface User {
  id: number;
  uuid:string;
  name?: string;
  profilePicUrl?: string;
  email?: string;
  password?: string;
  verified?: boolean;
  roles?: Role[];
  status?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?:Date;
}

class UserModel {
  constructor(private readonly db: Database) {}

  async insert(user: User): Promise<User | null> {
    const sql = `
      INSERT INTO users(name, profilePicUrl, email, password, verified, status, createdAt, updatedAt)
      VALUES($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING *
    `;
    const values = [
      user.name || null,
      user.profilePicUrl || null,
      user.email || null,
      user.password || null,
      user.verified || false,
      user.status || true,
      user.createdAt || new Date(),
      user.updatedAt || new Date(),
    ];

    try {
      const result: QueryResult = await this.db.query(sql, values);
      return result.rows[0];
    } catch (error) {
      console.error('Error inserting user:', error);
      return null;
    }
  }

  async findByEmail(email: string): Promise<User | null> {
    const sql = 'SELECT * FROM users WHERE email = $1';
    const values = [email];

    try {
      const result: QueryResult = await this.db.query(sql, values);
      return result.rows[0] || null;
    } catch (error) {
      console.error('Error finding user by email:', error);
      return null;
    }
  }

  // Add more CRUD methods as needed
}

export { UserModel };
