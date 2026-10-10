package com.pathos.knowledge;

import java.util.List;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SkillRepository extends JpaRepository<Skill, UUID> {

    Optional<Skill> findByCanonicalName(String canonicalName);

    List<Skill> findByActiveTrue();
}
