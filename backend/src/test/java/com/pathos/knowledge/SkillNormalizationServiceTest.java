package com.pathos.knowledge;

import static org.assertj.core.api.Assertions.assertThat;

import java.util.List;
import org.flywaydb.core.Flyway;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

/**
 * Verifies the V2.0 -&gt; V2.1 profile-skill normalization strategy: known
 * skills (by exact name, case/whitespace-insensitive) map to a canonical
 * Skill; unknown free-text entries are preserved unmatched, never dropped
 * or rewritten. Against real pathos_test, same pattern as the other V2.1
 * tests.
 */
@SpringBootTest
class SkillNormalizationServiceTest {

    @Autowired
    private SkillNormalizationService skillNormalizationService;

    @Autowired
    private Flyway flyway;

    @BeforeEach
    void resetDatabase() {
        flyway.clean();
        flyway.migrate();
    }

    @Test
    void emptyOrNullInputProducesNoMatches() {
        assertThat(skillNormalizationService.normalize(null)).isEmpty();
        assertThat(skillNormalizationService.normalize(List.of())).isEmpty();
    }

    @Test
    void knownSkillNameMatchesCaseAndWhitespaceInsensitively() {
        List<SkillMatch> matches = skillNormalizationService.normalize(List.of("  docker  ", "DOCKER", "Docker"));

        assertThat(matches).hasSize(3);
        assertThat(matches).allSatisfy(match -> {
            assertThat(match.matched()).isTrue();
            assertThat(match.skillName()).isEqualTo("Docker");
            assertThat(match.skillId()).isNotNull();
        });
    }

    @Test
    void unknownSkillIsPreservedUnmatchedNotDropped() {
        List<SkillMatch> matches = skillNormalizationService.normalize(List.of("Underwater Basket Weaving"));

        assertThat(matches).hasSize(1);
        SkillMatch match = matches.get(0);
        assertThat(match.matched()).isFalse();
        assertThat(match.skillId()).isNull();
        // The original, exact text is preserved -- never discarded.
        assertThat(match.rawText()).isEqualTo("Underwater Basket Weaving");
    }

    @Test
    void mixedKnownAndUnknownSkillsPreserveOrderAndCount() {
        List<SkillMatch> matches = skillNormalizationService.normalize(List.of("Python", "Some Made-Up Skill", "AWS"));

        assertThat(matches).hasSize(3);
        assertThat(matches.get(0).matched()).isTrue();
        assertThat(matches.get(1).matched()).isFalse();
        assertThat(matches.get(2).matched()).isTrue();
    }

    @Test
    void ambiguousTermsAreNeverCrossMatched() {
        // "Java" and "JavaScript" are deliberately distinct seeded skills --
        // confirms normalize() does exact matching only, no fuzzy guessing.
        List<SkillMatch> matches = skillNormalizationService.normalize(List.of("Java"));

        assertThat(matches).hasSize(1);
        assertThat(matches.get(0).skillName()).isEqualTo("Java");
        assertThat(matches.get(0).skillName()).isNotEqualTo("JavaScript");
    }
}
