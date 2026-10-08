package com.pathos.knowledge;

import static org.assertj.core.api.Assertions.assertThat;

import org.flywaydb.core.Flyway;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

/**
 * Verifies the seeded learning_resources data (V7 migration) against a
 * real local PostgreSQL (pathos_test).
 */
@SpringBootTest
class LearningResourceRepositoryTest {

    @Autowired
    private LearningResourceRepository learningResourceRepository;

    @Autowired
    private SkillRepository skillRepository;

    @Autowired
    private Flyway flyway;

    @BeforeEach
    void resetDatabase() {
        flyway.clean();
        flyway.migrate();
    }

    @Test
    void tenLearningResourcesAreSeeded() {
        assertThat(learningResourceRepository.findAll()).hasSize(10);
    }

    @Test
    void everySeededResourceHasAValidHttpsUrl() {
        for (LearningResource resource : learningResourceRepository.findAll()) {
            assertThat(resource.getUrl()).startsWith("https://");
            assertThat(resource.isActive()).isTrue();
        }
    }

    @Test
    void dockerHasALinkedLearningResource() {
        var docker = skillRepository.findByCanonicalName("docker").orElseThrow();
        var resources = learningResourceRepository.findBySkillId(docker.getId());

        assertThat(resources).isNotEmpty();
        assertThat(resources.get(0).getResourceType()).isNotNull();
    }
}
