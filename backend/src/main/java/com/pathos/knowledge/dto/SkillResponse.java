package com.pathos.knowledge.dto;

import com.pathos.knowledge.Skill;
import java.util.List;
import java.util.UUID;

public record SkillResponse(
    UUID id,
    String name,
    String description,
    UUID categoryId,
    String categoryName,
    List<String> aliases
) {

    public static SkillResponse from(Skill skill) {
        return new SkillResponse(
            skill.getId(),
            skill.getName(),
            skill.getDescription(),
            skill.getCategory() == null ? null : skill.getCategory().getId(),
            skill.getCategory() == null ? null : skill.getCategory().getName(),
            skill.getAliases()
        );
    }
}
