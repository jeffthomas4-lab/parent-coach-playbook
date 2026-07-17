PRAGMA foreign_keys=ON;
CREATE TABLE organizations (id TEXT PRIMARY KEY, name TEXT NOT NULL);
CREATE TABLE programs (
  id TEXT PRIMARY KEY,
  organization_id TEXT NOT NULL REFERENCES organizations(id),
  name TEXT NOT NULL
);
INSERT INTO organizations (id, name) VALUES ('org-1', 'Fixture Organization');
INSERT INTO programs (id, organization_id, name) VALUES ('program-1', 'org-1', 'Fixture Program');
