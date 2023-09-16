export const DOCUMENT_NAME = 'ApiKey';
export const COLLECTION_NAME = 'api_keys';

export enum Permission {
  GENERAL = 'GENERAL',
}

export default interface ApiKey {
  id: number;
  key: string;
  version: number;
  permissions: Permission[];
  comments: string[];
  status?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}
// CREATE TABLE api_keys (
//   _id SERIAL PRIMARY KEY,
//   key VARCHAR(1024) UNIQUE NOT NULL,
//   version INT NOT NULL CHECK (version >= 1 AND version <= 100),
//   permissions VARCHAR(255)[] NOT NULL,
//   comments VARCHAR(1000)[] NOT NULL,
//   status BOOLEAN DEFAULT true,
//   createdAt TIMESTAMP NOT NULL,
//   updatedAt TIMESTAMP NOT NULL
// );

