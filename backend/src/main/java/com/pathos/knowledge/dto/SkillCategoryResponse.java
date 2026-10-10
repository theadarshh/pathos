package com.pathos.knowledge.dto;

import com.pathos.knowledge.SkillCategory;
import java.util.UUID;

public record SkillCategoryResponse(UUID id, String name, String description) {

    public static SkillCategoryResponse from(SkillCategory category) {
        return new SkillCategoryResponse(category.getId(), category.getName(), category.getDescription());
    }
}
