-- V2.1 Career Knowledge Model — structural schema only (no data yet; see
-- V4/V5/V6/V7 for seed data). This migration is purely additive: it does
-- not touch `users` or `profiles` (V1/V2) in any way, and does not alter
-- Profile.skills (still a free-text List<String> column). The "safe
-- migration strategy" from V2.0's temporary skill representation toward
-- these canonical tables is a service-level normalization step
-- (see com.pathos.knowledge.SkillNormalizationService), not a destructive
-- schema change — existing profile skill data is never rewritten here.
--
-- Tables, in dependency order:
--   skill_categories   - plain reference data (Programming, Cloud, ...)
--   skills             - canonical skills, each optionally in a category
--   career_roles       - persistent career paths (was a hardcoded JS map in V1)
--   role_requirements  - which skills a role needs, REQUIRED vs PREFERRED
--   skill_relationships- skill-to-skill graph edges (prerequisite/related/transferable)
--   career_transitions - role-to-role transition knowledge
--   learning_resources - small curated set of resources, each tied to a skill

CREATE TABLE skill_categories (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name        VARCHAR(100) NOT NULL,
    description VARCHAR(500),
    active      BOOLEAN NOT NULL DEFAULT true,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT uq_skill_categories_name UNIQUE (name)
);

CREATE TABLE skills (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name            VARCHAR(150) NOT NULL,
    -- Trimmed, lowercased form of `name`, used for exact-match normalization
    -- of free-text profile skills (see SkillNormalizationService). Computed
    -- in the application layer at write time, not by a DB trigger.
    canonical_name  VARCHAR(150) NOT NULL,
    category_id     UUID REFERENCES skill_categories (id) ON DELETE SET NULL,
    description     VARCHAR(500),
    -- JSON array of alternate names (e.g. ["k8s"] for "Kubernetes"), same
    -- TEXT + AttributeConverter representation used by Profile.skills in
    -- V2.0, via the new shared com.pathos.shared.StringListConverter.
    aliases         TEXT NOT NULL DEFAULT '[]',
    active          BOOLEAN NOT NULL DEFAULT true,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT uq_skills_canonical_name UNIQUE (canonical_name)
);
CREATE INDEX idx_skills_category_id ON skills (category_id);

CREATE TABLE career_roles (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name            VARCHAR(150) NOT NULL,
    canonical_name  VARCHAR(150) NOT NULL,
    description     VARCHAR(1000),
    -- Free-text domain/category label (e.g. "DevOps", "Cloud", "Data").
    -- Deliberately NOT a FK to skill_categories — a role's domain and a
    -- skill's category are different classifications.
    domain          VARCHAR(100),
    active          BOOLEAN NOT NULL DEFAULT true,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT uq_career_roles_canonical_name UNIQUE (canonical_name)
);

CREATE TABLE role_requirements (
    id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    role_id           UUID NOT NULL REFERENCES career_roles (id) ON DELETE CASCADE,
    skill_id          UUID NOT NULL REFERENCES skills (id) ON DELETE CASCADE,
    requirement_type  VARCHAR(20) NOT NULL CHECK (requirement_type IN ('REQUIRED', 'PREFERRED')),
    -- Importance within the role, 1 (low) - 10 (high). This is knowledge
    -- data, not a computed compatibility score — scoring itself is V2.2.
    weight            INTEGER NOT NULL DEFAULT 5 CHECK (weight BETWEEN 1 AND 10),
    created_at        TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at        TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT uq_role_requirements_role_skill UNIQUE (role_id, skill_id)
);
CREATE INDEX idx_role_requirements_role_id ON role_requirements (role_id);
CREATE INDEX idx_role_requirements_skill_id ON role_requirements (skill_id);

CREATE TABLE skill_relationships (
    id                 UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    from_skill_id      UUID NOT NULL REFERENCES skills (id) ON DELETE CASCADE,
    to_skill_id        UUID NOT NULL REFERENCES skills (id) ON DELETE CASCADE,
    relationship_type  VARCHAR(30) NOT NULL CHECK (relationship_type IN ('PREREQUISITE_OF', 'RELATED_TO', 'TRANSFERABLE_TO')),
    weight             INTEGER NOT NULL DEFAULT 5 CHECK (weight BETWEEN 1 AND 10),
    created_at         TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at         TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT uq_skill_relationships_edge UNIQUE (from_skill_id, to_skill_id, relationship_type),
    CONSTRAINT chk_skill_relationships_no_self_loop CHECK (from_skill_id <> to_skill_id)
);
CREATE INDEX idx_skill_relationships_from ON skill_relationships (from_skill_id);
CREATE INDEX idx_skill_relationships_to ON skill_relationships (to_skill_id);

CREATE TABLE career_transitions (
    id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    source_role_id   UUID NOT NULL REFERENCES career_roles (id) ON DELETE CASCADE,
    target_role_id   UUID NOT NULL REFERENCES career_roles (id) ON DELETE CASCADE,
    difficulty       VARCHAR(20) NOT NULL CHECK (difficulty IN ('LOW', 'MEDIUM', 'HIGH')),
    rationale        VARCHAR(1000),
    active           BOOLEAN NOT NULL DEFAULT true,
    created_at       TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at       TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT uq_career_transitions_pair UNIQUE (source_role_id, target_role_id),
    CONSTRAINT chk_career_transitions_no_self_loop CHECK (source_role_id <> target_role_id)
);
CREATE INDEX idx_career_transitions_source ON career_transitions (source_role_id);
CREATE INDEX idx_career_transitions_target ON career_transitions (target_role_id);

CREATE TABLE learning_resources (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title           VARCHAR(255) NOT NULL,
    provider        VARCHAR(150),
    url             VARCHAR(500) NOT NULL,
    resource_type   VARCHAR(30) NOT NULL CHECK (resource_type IN ('COURSE', 'ARTICLE', 'DOCUMENTATION', 'VIDEO', 'BOOK', 'PROJECT')),
    skill_id        UUID REFERENCES skills (id) ON DELETE SET NULL,
    difficulty      VARCHAR(20) CHECK (difficulty IN ('BEGINNER', 'INTERMEDIATE', 'ADVANCED')),
    active          BOOLEAN NOT NULL DEFAULT true,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT uq_learning_resources_url UNIQUE (url)
);
CREATE INDEX idx_learning_resources_skill_id ON learning_resources (skill_id);
