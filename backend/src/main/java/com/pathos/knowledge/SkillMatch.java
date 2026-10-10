package com.pathos.knowledge;

import java.util.UUID;

/**
 * The result of attempting to map one free-text profile skill string onto
 * a canonical {@link Skill}. {@code matched=false} means the raw text is
 * an unmapped user claim — it is NOT discarded or rewritten anywhere;
 * callers keep showing/using the original {@code rawText} exactly as the
 * user entered it.
 */
public record SkillMatch(String rawText, UUID skillId, String skillName, boolean matched) {
}
