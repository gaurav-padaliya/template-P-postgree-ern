-- This extension is for uuid so we could use uuid
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

--If you want to drop table
DROP TABLE "TableName";

-- Want to see all tables 
SELECT *
FROM information_schema.tables
WHERE table_schema = 'public';

-- this is base table and all other table have to inherat this base table
CREATE TABLE base (
  id BIGSERIAL NOT NULL PRIMARY KEY,
  uuid UUID NOT NULL DEFAULT uuid_generate_v4(),
  createdAt TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updatedAt TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  deletedAt TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE (uuid)
);
-- This is 'users' table which is inheriting 'base' table

CREATE TABLE users (
  name TEXT,
  profilePicUrl TEXT,
  email TEXT,
  password TEXT,
  verified BOOLEAN,
  roles TEXT[],
  role_id BIGINT,
  status BOOLEAN,
  PRIMARY KEY (id)
) INHERITS (base);

-- This is 'roles' table which is inheriting 'base' table

CREATE TABLE roles (
  code VARCHAR(255) NOT NULL,
  status BOOLEAN DEFAULT true,
  PRIMARY KEY (id)
) INHERITS (base);

-- This is 'keystores' table which is inheriting 'base' table

CREATE TABLE keystores (
  client_id INT REFERENCES users(id),
  primaryKey VARCHAR(255) NOT NULL,
  secondaryKey VARCHAR(255) NOT NULL,
  status BOOLEAN DEFAULT true,
  PRIMARY KEY (id)
) INHERITS (base);

-- This is 'keystores' table which is inheriting 'base' table

CREATE TABLE api_keys (
  key VARCHAR(1024) UNIQUE NOT NULL,
  version INT NOT NULL CHECK (version >= 1 AND version <= 100),
  permissions VARCHAR(255)[] NOT NULL,
  comments VARCHAR(1000)[] NOT NULL,
  status BOOLEAN DEFAULT true,
  PRIMARY KEY (id)
) INHERITS (base);

