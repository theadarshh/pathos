package com.pathos.knowledge;

import java.util.List;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface RoleRequirementRepository extends JpaRepository<RoleRequirement, UUID> {

    List<RoleRequirement> findByRoleId(UUID roleId);
}
