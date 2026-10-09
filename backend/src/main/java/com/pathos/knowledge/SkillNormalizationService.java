package com.pathos.knowledge;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * The V2.0 -&gt; V2.1 profile-skill migration strategy, in code.
 *
 * <p>V2.0's {@code Profile.skills} is (and remains, in V2.1) a free-text
 * {@code List<String>} column — see {@code com.pathos.profile.Profile}
 * and {@code SkillListConverter}, both untouched by this migration. This
 * service does NOT rewrite that column, drop it, or migrate any existing
 * row. Instead it provides a read-only, additive lookup: given the raw
 * strings a profile already has, which ones match a canonical
 * {@link Skill} (by exact name or alias, case-insensitive) and which
 * remain unmapped user claims.
 *
 * <p>This is deliberately conservative: no fuzzy matching, no guessed
 * mappings for ambiguous terms (e.g. "Java" vs "JavaScript" are never
 * cross-matched). An unmapped skill is not an error — it is preserved
 * exactly as entered; nothing about a user's existing profile data is
 * ever destroyed or silently rewritten by calling this service.
 *
 * <p>The actual switch of Profile persistence to canonical skill ids is
 * intentionally NOT done here — see V2.1 KNOWLEDGE_MODEL.md "Migration
 * strategy". It is deferred until the V2.2 matching engine actually needs
 * canonical ids as its input, which is also when evidence/proficiency
 * (also out of scope here) will be designed.
 */
@Service
public class SkillNormalizationService {

    private final SkillRepository skillRepository;

    public SkillNormalizationService(SkillRepository skillRepository) {
        this.skillRepository = skillRepository;
    }

    @Transactional(readOnly = true)
    public List<SkillMatch> normalize(List<String> rawSkills) {
        if (rawSkills == null || rawSkills.isEmpty()) {
            return List.of();
        }
        Map<String, Skill> lookup = buildNormalizedLookup();
        return rawSkills.stream().map(raw -> matchOne(raw, lookup)).toList();
    }

    private Map<String, Skill> buildNormalizedLookup() {
        Map<String, Skill> lookup = new HashMap<>();
        for (Skill skill : skillRepository.findByActiveTrue()) {
            lookup.put(skill.getCanonicalName(), skill);
            for (String alias : skill.getAliases()) {
                // First skill to claim an alias wins; seed data is not
                // expected to have overlapping aliases, but this keeps
                // the lookup deterministic if it ever does.
                lookup.putIfAbsent(Skill.normalize(alias), skill);
            }
        }
        return lookup;
    }

    private SkillMatch matchOne(String raw, Map<String, Skill> lookup) {
        Skill matched = lookup.get(Skill.normalize(raw));
        if (matched == null) {
            return new SkillMatch(raw, null, null, false);
        }
        return new SkillMatch(raw, matched.getId(), matched.getName(), true);
    }
}
