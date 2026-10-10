package com.pathos.knowledge;

import static org.assertj.core.api.Assertions.assertThat;

import java.util.List;
import org.flywaydb.core.Flyway;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

/**
 * Verifies the seeded career_roles/role_requirements data (V5 migration)
 * against a real local PostgreSQL (pathos_test).
 */
@SpringBootTest
class CareerRoleRepositoryTest {

    @Autowired
    private CareerRoleRepository careerRoleRepository;

    @Autowired
    private RoleRequirementRepository roleRequirementRepository;

    @Autowired
    private Flyway flyway;

    @BeforeEach
    void resetDatabase() {
        flyway.clean();
        flyway.migrate();
    }

    @Test
    void eightCareerRolesAreSeeded() {
        assertThat(careerRoleRepository.findAll()).hasSize(8);
    }

    @Test
    void devOpsEngineerHasRequiredAndPreferredRequirements() {
        CareerRole devOps = careerRoleRepository.findByCanonicalName("devops engineer").orElseThrow();
        List<RoleRequirement> requirements = roleRequirementRepository.findByRoleId(devOps.getId());

        assertThat(requirements).isNotEmpty();
        assertThat(requirements)
            .filteredOn(r -> r.getRequirementType() == RequirementType.REQUIRED)
            .extracting(r -> r.getSkill().getName())
            .contains("Git", "AWS", "Docker", "CI/CD");
        assertThat(requirements)
            .filteredOn(r -> r.getRequirementType() == RequirementType.PREFERRED)
            .extracting(r -> r.getSkill().getName())
            .contains("Kubernetes", "Terraform");
    }

    @Test
    void requirementWeightIsWithinRange() {
        for (RoleRequirement requirement : roleRequirementRepository.findAll()) {
            assertThat(requirement.getWeight()).isBetween(1, 10);
        }
    }

    @Test
    void unknownRoleCanonicalNameIsNotFound() {
        assertThat(careerRoleRepository.findByCanonicalName("not-a-real-role")).isEmpty();
    }
}
