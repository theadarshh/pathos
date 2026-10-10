package com.pathos.knowledge;

import java.util.List;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CareerTransitionRepository extends JpaRepository<CareerTransition, UUID> {

    List<CareerTransition> findBySourceRoleId(UUID sourceRoleId);
}
