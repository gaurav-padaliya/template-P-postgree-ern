import { User } from './User';

export const DOCUMENT_NAME = 'Keystore';
export const COLLECTION_NAME = 'keystores';

export default interface Keystore {
  id: number;
  uuid: string;
  client: User;
  primaryKey: string;
  secondaryKey: string;
  status?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
}

// CREATE TABLE keystores (
//   id SERIAL PRIMARY KEY,
//   client_id INT REFERENCES users(_id),
//   primaryKey VARCHAR(255) NOT NULL,
//   secondaryKey VARCHAR(255) NOT NULL,
//   status BOOLEAN DEFAULT true,
//   createdAt TIMESTAMP NOT NULL,
//   updatedAt TIMESTAMP NOT NULL
// );
