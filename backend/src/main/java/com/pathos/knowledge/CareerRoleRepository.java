package com.pathos.knowledge;

import java.util.List;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CareerRoleRepository extends JpaRepository<CareerRole, UUID> {

    Optional<CareerRole> findByCanonicalName(String canonicalName);

    List<CareerRole> findByActiveTrue();
}
