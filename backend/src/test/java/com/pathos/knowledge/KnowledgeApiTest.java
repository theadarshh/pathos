package com.pathos.knowledge;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import java.util.UUID;
import org.flywaydb.core.Flyway;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.web.servlet.MockMvc;

/**
 * Exercises the read-only career knowledge API against a real local
 * PostgreSQL (pathos_test, Flyway clean()+migrate() per test) -- same
 * pattern as V2.0's AuthFlowTest/ProfileFlowTest. These endpoints require
 * NO Authorization header (see SecurityConfig): that's asserted directly
 * below, not assumed.
 */
@SpringBootTest
@AutoConfigureMockMvc
class KnowledgeApiTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private Flyway flyway;

    @Autowired
    private SkillRepository skillRepository;

    @Autowired
    private CareerRoleRepository careerRoleRepository;

    @BeforeEach
    void resetDatabase() {
        flyway.clean();
        flyway.migrate();
    }

    @Test
    void skillCategoriesAreReachableWithoutAuthentication() throws Exception {
        mockMvc.perform(get("/api/skill-categories"))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.length()").value(7));
    }

    @Test
    void skillsListIsReachableWithoutAuthentication() throws Exception {
        mockMvc.perform(get("/api/skills"))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$[0].name").exists());
    }

    @Test
    void getSkillByIdReturnsExpectedFields() throws Exception {
        UUID dockerId = skillRepository.findByCanonicalName("docker").orElseThrow().getId();

        mockMvc.perform(get("/api/skills/{id}", dockerId))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.name").value("Docker"))
            .andExpect(jsonPath("$.categoryName").value("DevOps"));
    }

    @Test
    void getSkillByUnknownIdReturns404() throws Exception {
        mockMvc.perform(get("/api/skills/{id}", UUID.randomUUID()))
            .andExpect(status().isNotFound())
            .andExpect(jsonPath("$.code").value("SKILL_NOT_FOUND"));
    }

    @Test
    void careerPathsListHasEightRoles() throws Exception {
        mockMvc.perform(get("/api/career-paths"))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.length()").value(8));
    }

    @Test
    void careerPathRequirementsReturnsRequiredAndPreferredSkills() throws Exception {
        UUID devOpsId = careerRoleRepository.findByCanonicalName("devops engineer").orElseThrow().getId();

        mockMvc.perform(get("/api/career-paths/{id}/requirements", devOpsId))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$[?(@.requirementType == 'REQUIRED')]").isNotEmpty())
            .andExpect(jsonPath("$[?(@.requirementType == 'PREFERRED')]").isNotEmpty());
    }

    @Test
    void careerPathRequirementsForUnknownRoleReturns404() throws Exception {
        mockMvc.perform(get("/api/career-paths/{id}/requirements", UUID.randomUUID()))
            .andExpect(status().isNotFound())
            .andExpect(jsonPath("$.code").value("CAREER_ROLE_NOT_FOUND"));
    }
}
