CREATE EXTENSION IF NOT EXISTS CITEXT;

DO $$ BEGIN
	CREATE TYPE ROLE AS ENUM('owner', 'editor', 'viewer');
EXCEPTION
	WHEN duplicate_object THEN null;
END $$;

CREATE TABLE IF NOT EXISTS pals (
	id CHAR(10) NOT NULL PRIMARY KEY,
	name VARCHAR(100) NOT NULL,
	email CITEXT NOT NULL UNIQUE,
	password TEXT NOT NULL,
	created TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS pens (
	id CHAR(10) NOT NULL PRIMARY KEY,
	name VARCHAR(100) NOT NULL,
	public BOOLEAN NOT NULL,
	created TIMESTAMPTZ NOT NULL DEFAULT NOW(),
	updated TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS roles (
	pal_id CHAR(10) NOT NULL REFERENCES pals(id) ON DELETE CASCADE,
	pen_id CHAR(10) NOT NULL REFERENCES pens(id) ON DELETE CASCADE,
	role ROLE NOT NULL,
	created TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS invites (
	id CHAR(10) NOT NULL PRIMARY KEY,
	pen_id CHAR(10) NOT NULL REFERENCES pens(id) ON DELETE CASCADE,
	role ROLE NOT NULL
);

CREATE TABLE IF NOT EXISTS sessions (
	sid TEXT NOT NULL PRIMARY KEY COLLATE "default" NOT DEFERRABLE INITIALLY IMMEDIATE,
	sess JSON NOT NULL,
	expire TIMESTAMP(6) NOT NULL
);

CREATE INDEX IF NOT EXISTS session_expire ON sessions(expire);

CREATE TABLE IF NOT EXISTS operations (
	id CHAR(10) NOT NULL,
	version INTEGER NOT NULL,
	operation JSON NOT NULL,
	PRIMARY KEY (id, version)
);

CREATE TABLE IF NOT EXISTS snapshots (
	id CHAR(10) NOT NULL PRIMARY KEY,
	type VARCHAR(255) NOT NULL,
	version INTEGER NOT NULL,
	data JSON NOT NULL
);
