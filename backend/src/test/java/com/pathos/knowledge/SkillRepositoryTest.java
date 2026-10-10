package com.pathos.knowledge;

import static org.assertj.core.api.Assertions.assertThat;

import org.flywaydb.core.Flyway;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

/**
 * Verifies the seeded skill_categories/skills data (V4 migration) against
 * a real local PostgreSQL (pathos_test), via Flyway clean()+migrate() so
 * every run starts from the actual migrations, not a hand-built fixture.
 */
@SpringBootTest
class SkillRepositoryTest {

    @Autowired
    private SkillRepository skillRepository;

    @Autowired
    private SkillCategoryRepository skillCategoryRepository;

    @Autowired
    private Flyway flyway;

    @BeforeEach
    void resetDatabase() {
        flyway.clean();
        flyway.migrate();
    }

    @Test
    void sevenSkillCategoriesAreSeeded() {
        assertThat(skillCategoryRepository.findAll()).hasSize(7);
    }

    @Test
    void seededSkillsAreActiveAndCategorized() {
        var skills = skillRepository.findByActiveTrue();
        assertThat(skills).isNotEmpty();
        assertThat(skills).allSatisfy(skill -> {
            assertThat(skill.isActive()).isTrue();
            assertThat(skill.getCategory()).isNotNull();
        });
    }

    @Test
    void canonicalNameLookupIsCaseInsensitiveByConstruction() {
        // canonical_name is stored already-lowercased (see Skill.normalize),
        // so a lookup by the normalized form must find the seeded "Docker".
        var docker = skillRepository.findByCanonicalName(Skill.normalize("  Docker  "));
        assertThat(docker).isPresent();
        assertThat(docker.get().getName()).isEqualTo("Docker");
    }

    @Test
    void unknownSkillNameIsNotFound() {
        assertThat(skillRepository.findByCanonicalName("definitely-not-a-seeded-skill")).isEmpty();
    }
}
