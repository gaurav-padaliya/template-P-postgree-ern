// Import your Database class
import { Database } from '..';
import Keystore from '../model/Keystore';
import { User } from '../model/User';
import KeystoreRepo from './KeystoreRepo';

class UserRepo {
  constructor(private readonly db: Database) {
    // Pass your Database instance
  }

  async exists(id: number): Promise<boolean> {
    const sql = 'SELECT 1 FROM users WHERE id = $1 AND status = true';
    const values = [id];

    try {
      const result = await this.db.query(sql, values);
      return result.rows.length > 0;
    } catch (error) {
      console.error('Error checking if user exists:', error);
      return false;
    }
  }

  async findPrivateProfileById(id: number): Promise<User | null> {
    const sql = `
      SELECT
        u.*,
        r.code AS role_code
      FROM
        users u
      LEFT JOIN
        roles r ON u.role_id = r.id
      WHERE
        u.id = $1 AND u.status = true AND r.status = true
    `;
    const values = [id];

    try {
      const result = await this.db.query(sql, values);
      return result.rows[0] || null;
    } catch (error) {
      console.error('Error finding private profile by ID:', error);
      return null;
    }
  }

  async findById(uuid: string): Promise<User | null> {
    const sql = `
      SELECT
        u.*,
        r.code AS role_code
      FROM
        users u
      LEFT JOIN
        roles r ON u.role_id = r.id
      WHERE
        u.uuid = $1 AND u.status = true AND r.status = true
    `;
    const values = [uuid];

    try {
      const result = await this.db.query(sql, values);
      return result.rows[0] || null;
    } catch (error) {
      console.error('Error finding user by ID:', error);
      return null;
    }
  }

  async findByEmail(email: string): Promise<User | null> {
    const sql = `
      SELECT
        u.*,
        r.code AS role_code
      FROM
        users u
      LEFT JOIN
        roles r ON u.role_id = r.id
      WHERE
        u.email = $1 AND u.status = true AND r.status = true
    `;
    const values = [email];

    try {
      const result = await this.db.query(sql, values);
      return result.rows[0] || null;
    } catch (error) {
      console.error('Error finding user by email:', error);
      return null;
    }
  }

  async findFieldsById(id: number, ...fields: string[]): Promise<User | null> {
    const fieldNames = fields.map((field) => `u.${field}`).join(', ');
    const sql = `
      SELECT
        ${fieldNames}
      FROM
        users u
      WHERE
        u.id = $1 AND u.status = true
    `;
    const values = [id];

    try {
      const result = await this.db.query(sql, values);
      return result.rows[0] || null;
    } catch (error) {
      console.error('Error finding user fields by ID:', error);
      return null;
    }
  }

  async findPublicProfileById(id: number): Promise<User | null> {
    const sql = 'SELECT * FROM users WHERE id = $1 AND status = true';
    const values = [id];

    try {
      const result = await this.db.query(sql, values);
      return result.rows[0] || null;
    } catch (error) {
      console.error('Error finding public profile by ID:', error);
      return null;
    }
  }

  async create(
    user: User,
    accessTokenKey: string,
    refreshTokenKey: string,
    roleCode: string,
  ): Promise<{ user: User; keystore: Keystore | null }> {
    const now = new Date();
    const roleSql = 'SELECT id FROM roles WHERE code = $1 AND status = true';
    const roleValues = [roleCode];

    try {
      const roleResult = await this.db.query(roleSql, roleValues);
      if (roleResult.rows.length === 0) {
        throw new Error('Role must be defined');
      }

      const role_id = roleResult.rows[0].id;
      const sql = `
        INSERT INTO users (name, profilePicUrl, email, password, verified, status, createdAt, updatedAt, role_id)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
        RETURNING *
      `;
      const values = [
        user.name || null,
        user.profilePicUrl || null,
        user.email || null,
        user.password || null,
        user.verified || false,
        user.status || true,
        user.createdAt || now,
        user.updatedAt || now,
        role_id,
      ];

      const result = await this.db.query(sql, values);
      const createdUser = result.rows[0];

      // Replace the following line with the logic to create a keystore in PostgreSQL
      const keystoreRepo = new KeystoreRepo(this.db);
      const keystore = await keystoreRepo.create(
        createdUser.id,
        accessTokenKey,
        refreshTokenKey,
      );

      return {
        user: createdUser,
        keystore: keystore,
      };
    } catch (error) {
      console.error('Error creating user:', error);
      throw new Error('Failed to create user');
    }
  }

  async update(
    user: User,
    accessTokenKey: string,
    refreshTokenKey: string,
  ): Promise<{ user: User; keystore: Keystore | null }> {
    user.updatedAt = new Date();
    const sql = `
      UPDATE users
      SET
        name = $2,
        profilePicUrl = $3,
        email = $4,
        password = $5,
        verified = $6,
        status = $7,
        createdAt = $8,
        updatedAt = $9
      WHERE
        id = $1
      RETURNING *
    `;
    const values = [
      user.id,
      user.name || null,
      user.profilePicUrl || null,
      user.email || null,
      user.password || null,
      user.verified || false,
      user.status || true,
      user.createdAt || new Date(),
      user.updatedAt,
    ];

    try {
      const result = await this.db.query(sql, values);

      // Replace the following line with the logic to create/update a keystore in PostgreSQL
      const keystoreRepo = new KeystoreRepo(this.db);
      const keystore = await keystoreRepo.create(
        user.id || 0,
        accessTokenKey,
        refreshTokenKey,
      );

      return {
        user: result.rows[0],
        keystore: keystore,
      };
    } catch (error) {
      console.error('Error updating user:', error);
      throw new Error('Failed to update user');
    }
  }

  async updateInfo(user: User): Promise<any> {
    user.updatedAt = new Date();
    const sql = `
      UPDATE users
      SET
        name = $2,
        profilePicUrl = $3,
        email = $4,
        password = $5,
        verified = $6,
        status = $7,
        createdAt = $8,
        updatedAt = $9
      WHERE
        id = $1
    `;
    const values = [
      user.id,
      user.name || null,
      user.profilePicUrl || null,
      user.email || null,
      user.password || null,
      user.verified || false,
      user.status || true,
      user.createdAt || new Date(),
      user.updatedAt,
    ];

    try {
      await this.db.query(sql, values);
    } catch (error) {
      console.error('Error updating user info:', error);
      throw new Error('Failed to update user info');
    }
  }
}

export default UserRepo;
