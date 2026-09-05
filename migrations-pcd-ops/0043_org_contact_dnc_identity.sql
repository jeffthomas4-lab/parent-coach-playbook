-- A do-not-contact decision must survive source-row soft deletion and
-- rediscovery. Keep normalized channel identities on the canonical PCD row so
-- the lookup stays indexed as the contact estate grows.

ALTER TABLE org_contacts ADD COLUMN email_identity TEXT;
ALTER TABLE org_contacts ADD COLUMN phone_identity TEXT;
ALTER TABLE org_contacts ADD COLUMN name_identity TEXT;

UPDATE org_contacts
SET email_identity=lower(trim(email))
WHERE email IS NOT NULL;

UPDATE org_contacts
SET name_identity=replace(replace(replace(lower(trim(full_name)),'  ',' '),'  ',' '),'  ',' ')
WHERE full_name IS NOT NULL;

WITH RECURSIVE phone_digits(id,rest,normalized) AS (
  SELECT id,phone,'' FROM org_contacts WHERE phone IS NOT NULL
  UNION ALL
  SELECT id,substr(rest,2),normalized || CASE
    WHEN substr(rest,1,1) BETWEEN '0' AND '9' THEN substr(rest,1,1)
    ELSE ''
  END
  FROM phone_digits
  WHERE rest<>''
), normalized_phones(id,normalized) AS (
  SELECT id,normalized FROM phone_digits WHERE rest=''
)
UPDATE org_contacts
SET phone_identity=NULLIF((SELECT normalized FROM normalized_phones
  WHERE normalized_phones.id=org_contacts.id),'')
WHERE phone IS NOT NULL;

CREATE INDEX idx_org_contacts_email_identity
  ON org_contacts(organization_id,email_identity,do_not_contact,deleted_at,updated_at)
  WHERE email_identity IS NOT NULL;

CREATE INDEX idx_org_contacts_phone_identity
  ON org_contacts(organization_id,phone_identity,do_not_contact,deleted_at,updated_at)
  WHERE phone_identity IS NOT NULL;

CREATE INDEX idx_org_contacts_name_identity
  ON org_contacts(organization_id,name_identity,do_not_contact,deleted_at,updated_at)
  WHERE name_identity IS NOT NULL;
