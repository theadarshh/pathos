-- Seed data for skill_relationships and career_transitions. This is a
-- small, deliberately conservative set of defensible, well-known
-- relationships -- not an attempt at a comprehensive skill graph. Each
-- edge below is an uncontroversial, widely recognized pairing; ambiguous
-- or debatable relationships were left out rather than guessed.

INSERT INTO skill_relationships (from_skill_id, to_skill_id, relationship_type, weight) VALUES
    ((SELECT id FROM skills WHERE canonical_name = 'linux'), (SELECT id FROM skills WHERE canonical_name = 'docker'), 'PREREQUISITE_OF', 8),
    ((SELECT id FROM skills WHERE canonical_name = 'docker'), (SELECT id FROM skills WHERE canonical_name = 'kubernetes'), 'PREREQUISITE_OF', 9),
    ((SELECT id FROM skills WHERE canonical_name = 'docker'), (SELECT id FROM skills WHERE canonical_name = 'ci/cd'), 'RELATED_TO', 6),
    ((SELECT id FROM skills WHERE canonical_name = 'git'), (SELECT id FROM skills WHERE canonical_name = 'ci/cd'), 'RELATED_TO', 7),
    ((SELECT id FROM skills WHERE canonical_name = 'networking'), (SELECT id FROM skills WHERE canonical_name = 'cloud security'), 'RELATED_TO', 7),
    ((SELECT id FROM skills WHERE canonical_name = 'aws'), (SELECT id FROM skills WHERE canonical_name = 'azure'), 'RELATED_TO', 5),
    ((SELECT id FROM skills WHERE canonical_name = 'aws'), (SELECT id FROM skills WHERE canonical_name = 'gcp'), 'RELATED_TO', 5),
    ((SELECT id FROM skills WHERE canonical_name = 'sql'), (SELECT id FROM skills WHERE canonical_name = 'data modeling'), 'RELATED_TO', 8),
    ((SELECT id FROM skills WHERE canonical_name = 'sql'), (SELECT id FROM skills WHERE canonical_name = 'etl pipelines'), 'TRANSFERABLE_TO', 6),
    ((SELECT id FROM skills WHERE canonical_name = 'python'), (SELECT id FROM skills WHERE canonical_name = 'prompt engineering'), 'TRANSFERABLE_TO', 5),
    ((SELECT id FROM skills WHERE canonical_name = 'terraform'), (SELECT id FROM skills WHERE canonical_name = 'kubernetes'), 'RELATED_TO', 6),
    ((SELECT id FROM skills WHERE canonical_name = 'iam'), (SELECT id FROM skills WHERE canonical_name = 'cloud security'), 'RELATED_TO', 7);

-- A small set of plausible transitions among the 8 seeded roles.
INSERT INTO career_transitions (source_role_id, target_role_id, difficulty, rationale) VALUES
    ((SELECT id FROM career_roles WHERE canonical_name = 'devops engineer'), (SELECT id FROM career_roles WHERE canonical_name = 'platform engineer'), 'LOW',
        'Shares the same core container/CI-CD/infrastructure-as-code skill set; mostly a shift in scope toward internal tooling.'),
    ((SELECT id FROM career_roles WHERE canonical_name = 'devops engineer'), (SELECT id FROM career_roles WHERE canonical_name = 'sre'), 'LOW',
        'Overlapping Linux/CI-CD/networking foundation; the main gap is an operational reliability and incident-response focus.'),
    ((SELECT id FROM career_roles WHERE canonical_name = 'cloud engineer'), (SELECT id FROM career_roles WHERE canonical_name = 'solutions architect'), 'MEDIUM',
        'Builds on the same cloud/networking/security base, adding broader architectural and cross-system design responsibility.'),
    ((SELECT id FROM career_roles WHERE canonical_name = 'cloud engineer'), (SELECT id FROM career_roles WHERE canonical_name = 'security engineer'), 'MEDIUM',
        'Shares networking and cloud-security fundamentals; requires deepening threat-modeling and identity/access expertise.'),
    ((SELECT id FROM career_roles WHERE canonical_name = 'data engineer'), (SELECT id FROM career_roles WHERE canonical_name = 'ai engineer'), 'MEDIUM',
        'Python and pipeline-building experience transfers, but requires picking up generative-AI-specific tooling and concepts.'),
    ((SELECT id FROM career_roles WHERE canonical_name = 'platform engineer'), (SELECT id FROM career_roles WHERE canonical_name = 'solutions architect'), 'HIGH',
        'Strong infrastructure depth helps, but the role shifts significantly toward business-facing architectural design.');
