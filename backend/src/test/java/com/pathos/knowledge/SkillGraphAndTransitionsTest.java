package com.pathos.knowledge;

import static org.assertj.core.api.Assertions.assertThat;

import org.flywaydb.core.Flyway;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

/**
 * Verifies the seeded skill_relationships/career_transitions data
 * (V6 migration) against a real local PostgreSQL (pathos_test).
 */
@SpringBootTest
class SkillGraphAndTransitionsTest {

    @Autowired
    private SkillRepository skillRepository;

    @Autowired
    private SkillRelationshipRepository skillRelationshipRepository;

    @Autowired
    private CareerRoleRepository careerRoleRepository;

    @Autowired
    private CareerTransitionRepository careerTransitionRepository;

    @Autowired
    private Flyway flyway;

    @BeforeEach
    void resetDatabase() {
        flyway.clean();
        flyway.migrate();
    }

    @Test
    void dockerPrerequisiteChainIsSeeded() {
        var linux = skillRepository.findByCanonicalName("linux").orElseThrow();
        var edges = skillRelationshipRepository.findByFromSkillId(linux.getId());

        assertThat(edges)
            .anySatisfy(edge -> {
                assertThat(edge.getToSkill().getName()).isEqualTo("Docker");
                assertThat(edge.getRelationshipType()).isEqualTo(RelationshipType.PREREQUISITE_OF);
                assertThat(edge.getWeight()).isBetween(1, 10);
            });
    }

    @Test
    void noSkillRelationshipIsASelfLoop() {
        for (SkillRelationship edge : skillRelationshipRepository.findAll()) {
            assertThat(edge.getFromSkill().getId()).isNotEqualTo(edge.getToSkill().getId());
        }
    }

    @Test
    void devOpsToPlatformEngineerTransitionIsSeeded() {
        var devOps = careerRoleRepository.findByCanonicalName("devops engineer").orElseThrow();
        var transitions = careerTransitionRepository.findBySourceRoleId(devOps.getId());

        assertThat(transitions)
            .anySatisfy(t -> {
                assertThat(t.getTargetRole().getName()).isEqualTo("Platform Engineer");
                assertThat(t.getDifficulty()).isEqualTo(TransitionDifficulty.LOW);
                assertThat(t.getRationale()).isNotBlank();
            });
    }

    @Test
    void noCareerTransitionIsASelfLoop() {
        for (CareerTransition transition : careerTransitionRepository.findAll()) {
            assertThat(transition.getSourceRole().getId()).isNotEqualTo(transition.getTargetRole().getId());
        }
    }
}
