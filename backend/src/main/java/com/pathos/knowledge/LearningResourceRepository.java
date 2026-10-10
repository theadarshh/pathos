package com.pathos.knowledge;

import java.util.List;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface LearningResourceRepository extends JpaRepository<LearningResource, UUID> {

    List<LearningResource> findBySkillId(UUID skillId);
}
