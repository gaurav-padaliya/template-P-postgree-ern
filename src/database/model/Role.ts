export const DOCUMENT_NAME = 'Role';
export const COLLECTION_NAME = 'roles';

export enum RoleCode {
  USER = 'USER',
  ADMIN = 'ADMIN',
}

export default interface Role {
  id: number;
  uuid:string;
  code: string;
  status?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

// CREATE TABLE roles (
//   code VARCHAR(255) NOT NULL,
//   status BOOLEAN DEFAULT true,
// ) ;