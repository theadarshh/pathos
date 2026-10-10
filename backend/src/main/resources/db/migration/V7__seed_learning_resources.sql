-- A small, curated set of learning resources, each linked to one
-- canonical skill. These are well-known, official/primary sources
-- (vendor docs, official tutorials) -- not scraped, not a marketplace,
-- not an attempt to cover every seeded skill.

INSERT INTO learning_resources (title, provider, url, resource_type, skill_id, difficulty) VALUES
    ('Docker: Get Started', 'Docker', 'https://docs.docker.com/get-started/', 'DOCUMENTATION',
        (SELECT id FROM skills WHERE canonical_name = 'docker'), 'BEGINNER'),
    ('Kubernetes Basics', 'Kubernetes.io', 'https://kubernetes.io/docs/tutorials/kubernetes-basics/', 'DOCUMENTATION',
        (SELECT id FROM skills WHERE canonical_name = 'kubernetes'), 'BEGINNER'),
    ('AWS Cloud Practitioner Essentials', 'AWS Training', 'https://aws.amazon.com/training/digital/aws-cloud-practitioner-essentials/', 'COURSE',
        (SELECT id FROM skills WHERE canonical_name = 'aws'), 'BEGINNER'),
    ('Terraform Tutorials', 'HashiCorp', 'https://developer.hashicorp.com/terraform/tutorials', 'DOCUMENTATION',
        (SELECT id FROM skills WHERE canonical_name = 'terraform'), 'INTERMEDIATE'),
    ('The Linux Command Line', 'William Shotts (free book)', 'https://linuxcommand.org/tlcl.php', 'BOOK',
        (SELECT id FROM skills WHERE canonical_name = 'linux'), 'BEGINNER'),
    ('The Python Tutorial', 'Python Software Foundation', 'https://docs.python.org/3/tutorial/', 'DOCUMENTATION',
        (SELECT id FROM skills WHERE canonical_name = 'python'), 'BEGINNER'),
    ('SQL Tutorial', 'Mode Analytics', 'https://mode.com/sql-tutorial/', 'COURSE',
        (SELECT id FROM skills WHERE canonical_name = 'sql'), 'BEGINNER'),
    ('Prompt Engineering Guide', 'promptingguide.ai', 'https://www.promptingguide.ai/', 'DOCUMENTATION',
        (SELECT id FROM skills WHERE canonical_name = 'prompt engineering'), 'INTERMEDIATE'),
    ('Git Handbook', 'GitHub', 'https://guides.github.com/introduction/git-handbook/', 'DOCUMENTATION',
        (SELECT id FROM skills WHERE canonical_name = 'git'), 'BEGINNER'),
    ('AWS Identity and Access Management (IAM) Documentation', 'AWS', 'https://docs.aws.amazon.com/IAM/latest/UserGuide/introduction.html', 'DOCUMENTATION',
        (SELECT id FROM skills WHERE canonical_name = 'iam'), 'INTERMEDIATE');
