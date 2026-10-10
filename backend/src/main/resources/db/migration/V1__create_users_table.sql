CREATE TABLE users (
    id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email         VARCHAR(255) NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT uq_users_email UNIQUE (email)
);

-- Case-insensitive uniqueness on email (register/login both normalize to
-- lowercase in the service layer; this index is a defense-in-depth backstop
-- against anything that bypasses the service).
CREATE UNIQUE INDEX uq_users_email_lower ON users (LOWER(email));
