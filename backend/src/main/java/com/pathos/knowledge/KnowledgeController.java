package com.pathos.knowledge;

import com.pathos.knowledge.dto.CareerRoleResponse;
import com.pathos.knowledge.dto.RoleRequirementResponse;
import com.pathos.knowledge.dto.SkillCategoryResponse;
import com.pathos.knowledge.dto.SkillResponse;
import java.util.List;
import java.util.UUID;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * Read-only career knowledge reference data (skills, categories, career
 * roles, role requirements). No write operations are exposed here -- the
 * data is seeded via Flyway (V4-V7), not mutated by clients. These
 * endpoints are public (see SecurityConfig): they carry no user data, so
 * requiring a JWT would only make V1's anonymous career-path browsing
 * break for nothing.
 */
@RestController
@RequestMapping("/api")
public class KnowledgeController {

    private final KnowledgeService knowledgeService;

    public KnowledgeController(KnowledgeService knowledgeService) {
        this.knowledgeService = knowledgeService;
    }

    @GetMapping("/skill-categories")
    public ResponseEntity<List<SkillCategoryResponse>> listSkillCategories() {
        return ResponseEntity.ok(knowledgeService.listSkillCategories());
    }

    @GetMapping("/skills")
    public ResponseEntity<List<SkillResponse>> listSkills() {
        return ResponseEntity.ok(knowledgeService.listSkills());
    }

    @GetMapping("/skills/{id}")
    public ResponseEntity<SkillResponse> getSkill(@PathVariable UUID id) {
        return ResponseEntity.ok(knowledgeService.getSkill(id));
    }

    @GetMapping("/career-paths")
    public ResponseEntity<List<CareerRoleResponse>> listCareerPaths() {
        return ResponseEntity.ok(knowledgeService.listCareerRoles());
    }

    @GetMapping("/career-paths/{id}")
    public ResponseEntity<CareerRoleResponse> getCareerPath(@PathVariable UUID id) {
        return ResponseEntity.ok(knowledgeService.getCareerRole(id));
    }

    @GetMapping("/career-paths/{id}/requirements")
    public ResponseEntity<List<RoleRequirementResponse>> getCareerPathRequirements(@PathVariable UUID id) {
        return ResponseEntity.ok(knowledgeService.getRoleRequirements(id));
    }
}
