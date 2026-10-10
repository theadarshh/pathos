package com.pathos.knowledge;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.flywaydb.core.Flyway;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

/**
 * V2.1 regression check: confirms the V2.0 profile API is completely
 * unaffected by the new career-knowledge schema. A profile can still
 * store arbitrary free-text skills -- including ones with no canonical
 * Skill match at all -- exactly as V2.0 behaved, because Profile.skills
 * was never touched by the V2.1 migrations (see V3-V7 and
 * SkillNormalizationService's doc comment).
 */
@SpringBootTest
@AutoConfigureMockMvc
class ProfileSkillCompatibilityTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private Flyway flyway;

    private final ObjectMapper json = new ObjectMapper();

    @BeforeEach
    void resetDatabase() {
        flyway.clean();
        flyway.migrate();
    }

    @Test
    void profileStillAcceptsFreeTextSkillsWithNoCanonicalMatch() throws Exception {
        String registerBody = """
            {"email":"grace@example.com","password":"correct-horse-battery"}
            """;
        String response = mockMvc.perform(post("/api/auth/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(registerBody))
            .andExpect(status().isCreated())
            .andReturn().getResponse().getContentAsString();
        String token = json.readTree(response).get("token").asText();

        String update = """
            {"role":"Software Developer","experience":2,"skills":["Docker","Underwater Basket Weaving"],"goal":"Grow as a Developer","complete":true}
            """;

        mockMvc.perform(put("/api/profile")
                .header("Authorization", "Bearer " + token)
                .contentType(MediaType.APPLICATION_JSON)
                .content(update))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.skills[0]").value("Docker"))
            .andExpect(jsonPath("$.skills[1]").value("Underwater Basket Weaving"));

        mockMvc.perform(get("/api/profile").header("Authorization", "Bearer " + token))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.skills.length()").value(2))
            .andExpect(jsonPath("$.skills[1]").value("Underwater Basket Weaving"));
    }
}
