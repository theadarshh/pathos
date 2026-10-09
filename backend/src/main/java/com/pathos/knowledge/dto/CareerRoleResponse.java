package com.pathos.knowledge.dto;

import com.pathos.knowledge.CareerRole;
import java.util.UUID;

public record CareerRoleResponse(UUID id, String name, String description, String domain) {

    public static CareerRoleResponse from(CareerRole role) {
        return new CareerRoleResponse(role.getId(), role.getName(), role.getDescription(), role.getDomain());
    }
}
