-- V2.0 profile representation.
--
-- `skills` is stored as a JSON array of plain strings (e.g. ["React","AWS"])
-- in a TEXT column, serialized/deserialized by a JPA AttributeConverter
-- (see com.pathos.profile.SkillListConverter). This mirrors V1's in-memory
-- `skills: string[]` exactly, so the V1 -> V2.0 migration changes nothing
-- about what a "skill" is yet.
--
-- THIS IS TEMPORARY. It is not the V2 skill model. The approved V2
-- architecture (see PathOS V2 Architecture proposal, section 3b/6) calls
-- for skills to become a normalized graph: a shared `skills` table, a
-- `skill_relationships` table (prerequisite/related/transferable edges),
-- and a `profile_skills` join table carrying per-user proficiency, plus a
-- `skill_evidence` table distinguishing claimed/demonstrated/verified.
-- That migration is scoped to V2.1 (career knowledge model) and V2.2
-- (evidence model) — deliberately NOT built here, per the V2.0 objective
-- of persistence only, no premature domain expansion.
CREATE TABLE profiles (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id     UUID NOT NULL,
    role        VARCHAR(255),
    experience  INTEGER,
    goal        VARCHAR(255),
    skills      TEXT NOT NULL DEFAULT '[]',
    complete    BOOLEAN NOT NULL DEFAULT false,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT fk_profiles_user FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE,
    CONSTRAINT uq_profiles_user_id UNIQUE (user_id),
    CONSTRAINT chk_profiles_experience_nonnegative CHECK (experience IS NULL OR experience >= 0)
);
