package com.pathos.knowledge;

import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SkillCategoryRepository extends JpaRepository<SkillCategory, UUID> {
}
