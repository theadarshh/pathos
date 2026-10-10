package com.pathos.knowledge.dto;

import com.pathos.knowledge.RoleRequirement;
import java.util.UUID;

public record RoleRequirementResponse(
    UUID skillId,
    String skillName,
    String requirementType,
    int weight
) {

    public static RoleRequirementResponse from(RoleRequirement requirement) {
        return new RoleRequirementResponse(
            requirement.getSkill().getId(),
            requirement.getSkill().getName(),
            requirement.getRequirementType().name(),
            requirement.getWeight()
        );
    }
}
