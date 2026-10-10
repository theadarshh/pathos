-- Seed data for career_roles and role_requirements, carried over from
-- V1's src/data/careerPaths.js (the PATHS map) -- same 8 roles, same
-- "core" / "next" / "later" skill groupings, now persisted instead of
-- hardcoded. Mapping: core -> REQUIRED (weight 9), next -> PREFERRED
-- (weight 6, excluding anything already REQUIRED), later -> PREFERRED
-- (weight 3, excluding anything already listed above). Role descriptions
-- are short original summaries (V1 had no role description field, only
-- a firstProject string and a per-skill reason bank).
--
-- Three skills referenced by careerPaths.js ("Observability", "MLOps",
-- "Multi-cloud design") existed only as blurb entries in V1's
-- src/data/skills.js, not in its SKILL_GROUPS -- likely a V1 oversight.
-- Seeded here (not in V4) since they were only discovered while mapping
-- role requirements; using their existing V1 blurb text.

INSERT INTO skills (name, canonical_name, category_id, description) VALUES
    ('Observability', 'observability', (SELECT id FROM skill_categories WHERE name = 'DevOps'),
        'Monitor, log and trace systems to understand their real-time health.'),
    ('MLOps', 'mlops', (SELECT id FROM skill_categories WHERE name = 'AI'),
        'Operationalize machine learning models in production.'),
    ('Multi-cloud design', 'multi-cloud design', (SELECT id FROM skill_categories WHERE name = 'Cloud'),
        'Architect systems that span more than one cloud provider.');

INSERT INTO career_roles (name, canonical_name, description, domain) VALUES
    ('DevOps Engineer', 'devops engineer',
        'Builds and runs the automation, CI/CD and infrastructure that let teams ship reliably.', 'DevOps'),
    ('Cloud Engineer', 'cloud engineer',
        'Designs and operates applications and infrastructure on public cloud platforms.', 'Cloud'),
    ('Platform Engineer', 'platform engineer',
        'Builds internal platforms and self-service tooling so other engineers can ship faster.', 'DevOps'),
    ('SRE', 'sre',
        'Keeps production systems reliable through monitoring, automation and incident response.', 'DevOps'),
    ('AI Engineer', 'ai engineer',
        'Builds applied AI systems and products on top of generative-AI models.', 'AI'),
    ('Solutions Architect', 'solutions architect',
        'Designs end-to-end technical architectures that meet business and scalability needs.', 'Cloud'),
    ('Data Engineer', 'data engineer',
        'Builds the pipelines and data infrastructure that make reliable analytics possible.', 'Data'),
    ('Security Engineer', 'security engineer',
        'Protects systems and data by hardening infrastructure and modeling threats.', 'Security');

-- DevOps Engineer
INSERT INTO role_requirements (role_id, skill_id, requirement_type, weight) VALUES
    ((SELECT id FROM career_roles WHERE canonical_name = 'devops engineer'), (SELECT id FROM skills WHERE canonical_name = 'git'), 'REQUIRED', 9),
    ((SELECT id FROM career_roles WHERE canonical_name = 'devops engineer'), (SELECT id FROM skills WHERE canonical_name = 'aws'), 'REQUIRED', 9),
    ((SELECT id FROM career_roles WHERE canonical_name = 'devops engineer'), (SELECT id FROM skills WHERE canonical_name = 'docker'), 'REQUIRED', 9),
    ((SELECT id FROM career_roles WHERE canonical_name = 'devops engineer'), (SELECT id FROM skills WHERE canonical_name = 'ci/cd'), 'REQUIRED', 9),
    ((SELECT id FROM career_roles WHERE canonical_name = 'devops engineer'), (SELECT id FROM skills WHERE canonical_name = 'linux'), 'PREFERRED', 6),
    ((SELECT id FROM career_roles WHERE canonical_name = 'devops engineer'), (SELECT id FROM skills WHERE canonical_name = 'kubernetes'), 'PREFERRED', 3),
    ((SELECT id FROM career_roles WHERE canonical_name = 'devops engineer'), (SELECT id FROM skills WHERE canonical_name = 'terraform'), 'PREFERRED', 3);

-- Cloud Engineer
INSERT INTO role_requirements (role_id, skill_id, requirement_type, weight) VALUES
    ((SELECT id FROM career_roles WHERE canonical_name = 'cloud engineer'), (SELECT id FROM skills WHERE canonical_name = 'aws'), 'REQUIRED', 9),
    ((SELECT id FROM career_roles WHERE canonical_name = 'cloud engineer'), (SELECT id FROM skills WHERE canonical_name = 'networking'), 'REQUIRED', 9),
    ((SELECT id FROM career_roles WHERE canonical_name = 'cloud engineer'), (SELECT id FROM skills WHERE canonical_name = 'linux'), 'REQUIRED', 9),
    ((SELECT id FROM career_roles WHERE canonical_name = 'cloud engineer'), (SELECT id FROM skills WHERE canonical_name = 'terraform'), 'PREFERRED', 6),
    ((SELECT id FROM career_roles WHERE canonical_name = 'cloud engineer'), (SELECT id FROM skills WHERE canonical_name = 'kubernetes'), 'PREFERRED', 3),
    ((SELECT id FROM career_roles WHERE canonical_name = 'cloud engineer'), (SELECT id FROM skills WHERE canonical_name = 'cloud security'), 'PREFERRED', 3);

-- Platform Engineer
INSERT INTO role_requirements (role_id, skill_id, requirement_type, weight) VALUES
    ((SELECT id FROM career_roles WHERE canonical_name = 'platform engineer'), (SELECT id FROM skills WHERE canonical_name = 'docker'), 'REQUIRED', 9),
    ((SELECT id FROM career_roles WHERE canonical_name = 'platform engineer'), (SELECT id FROM skills WHERE canonical_name = 'kubernetes'), 'REQUIRED', 9),
    ((SELECT id FROM career_roles WHERE canonical_name = 'platform engineer'), (SELECT id FROM skills WHERE canonical_name = 'terraform'), 'REQUIRED', 9),
    ((SELECT id FROM career_roles WHERE canonical_name = 'platform engineer'), (SELECT id FROM skills WHERE canonical_name = 'ci/cd'), 'PREFERRED', 6),
    ((SELECT id FROM career_roles WHERE canonical_name = 'platform engineer'), (SELECT id FROM skills WHERE canonical_name = 'cloud security'), 'PREFERRED', 3);

-- SRE
INSERT INTO role_requirements (role_id, skill_id, requirement_type, weight) VALUES
    ((SELECT id FROM career_roles WHERE canonical_name = 'sre'), (SELECT id FROM skills WHERE canonical_name = 'linux'), 'REQUIRED', 9),
    ((SELECT id FROM career_roles WHERE canonical_name = 'sre'), (SELECT id FROM skills WHERE canonical_name = 'ci/cd'), 'REQUIRED', 9),
    ((SELECT id FROM career_roles WHERE canonical_name = 'sre'), (SELECT id FROM skills WHERE canonical_name = 'networking'), 'REQUIRED', 9),
    ((SELECT id FROM career_roles WHERE canonical_name = 'sre'), (SELECT id FROM skills WHERE canonical_name = 'docker'), 'PREFERRED', 6),
    ((SELECT id FROM career_roles WHERE canonical_name = 'sre'), (SELECT id FROM skills WHERE canonical_name = 'kubernetes'), 'PREFERRED', 6),
    ((SELECT id FROM career_roles WHERE canonical_name = 'sre'), (SELECT id FROM skills WHERE canonical_name = 'terraform'), 'PREFERRED', 3),
    ((SELECT id FROM career_roles WHERE canonical_name = 'sre'), (SELECT id FROM skills WHERE canonical_name = 'observability'), 'PREFERRED', 3);

-- AI Engineer
INSERT INTO role_requirements (role_id, skill_id, requirement_type, weight) VALUES
    ((SELECT id FROM career_roles WHERE canonical_name = 'ai engineer'), (SELECT id FROM skills WHERE canonical_name = 'python'), 'REQUIRED', 9),
    ((SELECT id FROM career_roles WHERE canonical_name = 'ai engineer'), (SELECT id FROM skills WHERE canonical_name = 'generative ai'), 'REQUIRED', 9),
    ((SELECT id FROM career_roles WHERE canonical_name = 'ai engineer'), (SELECT id FROM skills WHERE canonical_name = 'prompt engineering'), 'PREFERRED', 6),
    ((SELECT id FROM career_roles WHERE canonical_name = 'ai engineer'), (SELECT id FROM skills WHERE canonical_name = 'rag'), 'PREFERRED', 6),
    ((SELECT id FROM career_roles WHERE canonical_name = 'ai engineer'), (SELECT id FROM skills WHERE canonical_name = 'ai agents'), 'PREFERRED', 3),
    ((SELECT id FROM career_roles WHERE canonical_name = 'ai engineer'), (SELECT id FROM skills WHERE canonical_name = 'mlops'), 'PREFERRED', 3);

-- Solutions Architect
INSERT INTO role_requirements (role_id, skill_id, requirement_type, weight) VALUES
    ((SELECT id FROM career_roles WHERE canonical_name = 'solutions architect'), (SELECT id FROM skills WHERE canonical_name = 'aws'), 'REQUIRED', 9),
    ((SELECT id FROM career_roles WHERE canonical_name = 'solutions architect'), (SELECT id FROM skills WHERE canonical_name = 'networking'), 'REQUIRED', 9),
    ((SELECT id FROM career_roles WHERE canonical_name = 'solutions architect'), (SELECT id FROM skills WHERE canonical_name = 'cloud security'), 'REQUIRED', 9),
    ((SELECT id FROM career_roles WHERE canonical_name = 'solutions architect'), (SELECT id FROM skills WHERE canonical_name = 'terraform'), 'PREFERRED', 6),
    ((SELECT id FROM career_roles WHERE canonical_name = 'solutions architect'), (SELECT id FROM skills WHERE canonical_name = 'multi-cloud design'), 'PREFERRED', 3);

-- Data Engineer
INSERT INTO role_requirements (role_id, skill_id, requirement_type, weight) VALUES
    ((SELECT id FROM career_roles WHERE canonical_name = 'data engineer'), (SELECT id FROM skills WHERE canonical_name = 'python'), 'REQUIRED', 9),
    ((SELECT id FROM career_roles WHERE canonical_name = 'data engineer'), (SELECT id FROM skills WHERE canonical_name = 'sql'), 'REQUIRED', 9),
    ((SELECT id FROM career_roles WHERE canonical_name = 'data engineer'), (SELECT id FROM skills WHERE canonical_name = 'etl pipelines'), 'REQUIRED', 9),
    ((SELECT id FROM career_roles WHERE canonical_name = 'data engineer'), (SELECT id FROM skills WHERE canonical_name = 'data modeling'), 'PREFERRED', 6),
    ((SELECT id FROM career_roles WHERE canonical_name = 'data engineer'), (SELECT id FROM skills WHERE canonical_name = 'spark'), 'PREFERRED', 3),
    ((SELECT id FROM career_roles WHERE canonical_name = 'data engineer'), (SELECT id FROM skills WHERE canonical_name = 'cloud security'), 'PREFERRED', 3);

-- Security Engineer
INSERT INTO role_requirements (role_id, skill_id, requirement_type, weight) VALUES
    ((SELECT id FROM career_roles WHERE canonical_name = 'security engineer'), (SELECT id FROM skills WHERE canonical_name = 'networking'), 'REQUIRED', 9),
    ((SELECT id FROM career_roles WHERE canonical_name = 'security engineer'), (SELECT id FROM skills WHERE canonical_name = 'linux'), 'REQUIRED', 9),
    ((SELECT id FROM career_roles WHERE canonical_name = 'security engineer'), (SELECT id FROM skills WHERE canonical_name = 'cloud security'), 'REQUIRED', 9),
    ((SELECT id FROM career_roles WHERE canonical_name = 'security engineer'), (SELECT id FROM skills WHERE canonical_name = 'iam'), 'PREFERRED', 6),
    ((SELECT id FROM career_roles WHERE canonical_name = 'security engineer'), (SELECT id FROM skills WHERE canonical_name = 'threat modeling'), 'PREFERRED', 3);
