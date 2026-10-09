package com.pathos.knowledge;

import com.pathos.knowledge.dto.CareerRoleResponse;
import com.pathos.knowledge.dto.RoleRequirementResponse;
import com.pathos.knowledge.dto.SkillCategoryResponse;
import com.pathos.knowledge.dto.SkillResponse;
import com.pathos.shared.ApiException;
import java.util.List;
import java.util.UUID;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Read-only access to career knowledge reference data. There is
 * deliberately no write path here for ordinary users -- this data is
 * seeded via Flyway migrations only (see V4-V7), not mutated at runtime.
 */
@Service
@Transactional(readOnly = true)
public class KnowledgeService {

    private final SkillCategoryRepository skillCategoryRepository;
    private final SkillRepository skillRepository;
    private final CareerRoleRepository careerRoleRepository;
    private final RoleRequirementRepository roleRequirementRepository;

    public KnowledgeService(
        SkillCategoryRepository skillCategoryRepository,
        SkillRepository skillRepository,
        CareerRoleRepository careerRoleRepository,
        RoleRequirementRepository roleRequirementRepository
    ) {
        this.skillCategoryRepository = skillCategoryRepository;
        this.skillRepository = skillRepository;
        this.careerRoleRepository = careerRoleRepository;
        this.roleRequirementRepository = roleRequirementRepository;
    }

    public List<SkillCategoryResponse> listSkillCategories() {
        return skillCategoryRepository.findAll().stream()
            .map(SkillCategoryResponse::from)
            .toList();
    }

    public List<SkillResponse> listSkills() {
        return skillRepository.findByActiveTrue().stream()
            .map(SkillResponse::from)
            .toList();
    }

    public SkillResponse getSkill(UUID id) {
        return SkillResponse.from(findSkillOrThrow(id));
    }

    public List<CareerRoleResponse> listCareerRoles() {
        return careerRoleRepository.findByActiveTrue().stream()
            .map(CareerRoleResponse::from)
            .toList();
    }

    public CareerRoleResponse getCareerRole(UUID id) {
        return CareerRoleResponse.from(findRoleOrThrow(id));
    }

    public List<RoleRequirementResponse> getRoleRequirements(UUID roleId) {
        findRoleOrThrow(roleId); // 404 before an empty-but-valid list is returned for a bad id
        return roleRequirementRepository.findByRoleId(roleId).stream()
            .map(RoleRequirementResponse::from)
            .toList();
    }

    private Skill findSkillOrThrow(UUID id) {
        return skillRepository.findById(id)
            .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "SKILL_NOT_FOUND", "No skill found with this id."));
    }

    private CareerRole findRoleOrThrow(UUID id) {
        return careerRoleRepository.findById(id)
            .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "CAREER_ROLE_NOT_FOUND", "No career role found with this id."));
    }
}
