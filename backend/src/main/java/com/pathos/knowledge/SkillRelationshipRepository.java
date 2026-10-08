package com.pathos.knowledge;

import java.util.List;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SkillRelationshipRepository extends JpaRepository<SkillRelationship, UUID> {

    List<SkillRelationship> findByFromSkillId(UUID fromSkillId);
}
