-- Seed data for skill_categories and skills. Sourced from V1's existing
-- src/data/skills.js (SKILL_GROUPS + SKILL_BLURBS), carried into the
-- canonical model rather than reinvented -- this is the same skill set
-- V1 already used for Skill Gap / Learn Next, now backed by the database
-- instead of a hardcoded JS object. A handful of skills with no existing
-- V1 blurb (JavaScript, TypeScript, React, Java, .NET, Generative AI) get
-- a short original description here.
--
-- Quality over coverage: this is a curated starter set, not a claim to
-- cover the full job market.

INSERT INTO skill_categories (name, description) VALUES
    ('Development', 'General-purpose programming languages and frameworks.'),
    ('Cloud', 'Public cloud platforms.'),
    ('Infrastructure', 'Operating systems and networking fundamentals.'),
    ('DevOps', 'Build, release and infrastructure-automation tooling.'),
    ('AI', 'Applied AI and generative-AI tooling.'),
    ('Data', 'Data storage, modeling and pipeline skills.'),
    ('Security', 'Cloud and infrastructure security skills.');

INSERT INTO skills (name, canonical_name, category_id, description) VALUES
    ('JavaScript', 'javascript', (SELECT id FROM skill_categories WHERE name = 'Development'),
        'The core language of the web, used across frontend and Node.js backend development.'),
    ('TypeScript', 'typescript', (SELECT id FROM skill_categories WHERE name = 'Development'),
        'A typed superset of JavaScript that catches errors before runtime and scales better on larger codebases.'),
    ('React', 'react', (SELECT id FROM skill_categories WHERE name = 'Development'),
        'A component-based UI library and the most common choice for building modern web frontends.'),
    ('Java', 'java', (SELECT id FROM skill_categories WHERE name = 'Development'),
        'A mature, widely used language for backend systems, enterprise applications and Android.'),
    ('Python', 'python', (SELECT id FROM skill_categories WHERE name = 'Development'),
        'A versatile language widely used across AI, automation and scripting.'),
    ('.NET', '.net', (SELECT id FROM skill_categories WHERE name = 'Development'),
        'Microsoft''s application framework for building backend services and enterprise software in C#.'),

    ('AWS', 'aws', (SELECT id FROM skill_categories WHERE name = 'Cloud'),
        'The most widely used cloud platform; a strong entry point into cloud roles.'),
    ('Azure', 'azure', (SELECT id FROM skill_categories WHERE name = 'Cloud'),
        'Microsoft''s cloud platform, common in enterprise environments.'),
    ('GCP', 'gcp', (SELECT id FROM skill_categories WHERE name = 'Cloud'),
        'Google''s cloud platform, strong in data and AI tooling.'),

    ('Linux', 'linux', (SELECT id FROM skill_categories WHERE name = 'Infrastructure'),
        'Core OS skills for managing servers and containers reliably.'),
    ('Networking', 'networking', (SELECT id FROM skill_categories WHERE name = 'Infrastructure'),
        'Understand how services communicate -- essential for cloud and ops roles.'),

    ('Git', 'git', (SELECT id FROM skill_categories WHERE name = 'DevOps'),
        'Track and collaborate on code changes -- foundational for any engineering path.'),
    ('Docker', 'docker', (SELECT id FROM skill_categories WHERE name = 'DevOps'),
        'Package applications into portable containers -- the DevOps building block.'),
    ('Jenkins', 'jenkins', (SELECT id FROM skill_categories WHERE name = 'DevOps'),
        'A widely used automation server for build and deployment pipelines.'),
    ('CI/CD', 'ci/cd', (SELECT id FROM skill_categories WHERE name = 'DevOps'),
        'Automate build, test and deploy so releases become routine, not risky.'),
    ('Kubernetes', 'kubernetes', (SELECT id FROM skill_categories WHERE name = 'DevOps'),
        'Orchestrate containers at scale across clusters.'),
    ('Terraform', 'terraform', (SELECT id FROM skill_categories WHERE name = 'DevOps'),
        'Define infrastructure as code for repeatable, versioned environments.'),

    ('Generative AI', 'generative ai', (SELECT id FROM skill_categories WHERE name = 'AI'),
        'Models that generate new text, images or other content from a prompt -- the foundation of modern applied AI work.'),
    ('Prompt Engineering', 'prompt engineering', (SELECT id FROM skill_categories WHERE name = 'AI'),
        'Craft effective inputs to get reliable results from AI models.'),
    ('RAG', 'rag', (SELECT id FROM skill_categories WHERE name = 'AI'),
        'Combine retrieval with generation to ground AI answers in real data.'),
    ('AI Agents', 'ai agents', (SELECT id FROM skill_categories WHERE name = 'AI'),
        'Build systems where AI models take multi-step autonomous actions.'),

    ('SQL', 'sql', (SELECT id FROM skill_categories WHERE name = 'Data'),
        'Query and shape relational data -- foundational for any data role.'),
    ('Data Modeling', 'data modeling', (SELECT id FROM skill_categories WHERE name = 'Data'),
        'Design how data is structured and related for reliable analysis.'),
    ('ETL Pipelines', 'etl pipelines', (SELECT id FROM skill_categories WHERE name = 'Data'),
        'Extract, transform and load data reliably between systems.'),
    ('Spark', 'spark', (SELECT id FROM skill_categories WHERE name = 'Data'),
        'Process large-scale data across distributed clusters.'),

    ('Cloud Security', 'cloud security', (SELECT id FROM skill_categories WHERE name = 'Security'),
        'Protect cloud workloads, identities and data at scale.'),
    ('IAM', 'iam', (SELECT id FROM skill_categories WHERE name = 'Security'),
        'Manage identities and access so only the right people/systems reach a resource.'),
    ('Threat Modeling', 'threat modeling', (SELECT id FROM skill_categories WHERE name = 'Security'),
        'Systematically find where a system is likely to be attacked, before it is.');
