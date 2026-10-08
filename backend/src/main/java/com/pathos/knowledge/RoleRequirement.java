package com.pathos.knowledge;

import jakarta.persistence.*;
import java.time.Instant;
import java.util.UUID;

/**
 * One (role, skill) edge: how much a given skill matters for a given
 * role. This is knowledge data only — it does not compute a
 * compatibility/match score itself; that belongs to the V2.2 intelligence
 * engine, which will read these rows as its input.
 */
@Entity
@Table(name = "role_requirements")
public class RoleRequirement {

    @Id
    @GeneratedValue
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "role_id", nullable = false)
    private CareerRole role;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "skill_id", nullable = false)
    private Skill skill;

    @Enumerated(EnumType.STRING)
    @Column(name = "requirement_type", nullable = false)
    private RequirementType requirementType;

    /** Importance within the role, 1 (low) – 10 (high). */
    @Column(nullable = false)
    private int weight = 5;

    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;

    @Column(name = "updated_at", nullable = false)
    private Instant updatedAt;

    protected RoleRequirement() {
        // JPA
    }

    public RoleRequirement(CareerRole role, Skill skill, RequirementType requirementType, int weight) {
        this.role = role;
        this.skill = skill;
        this.requirementType = requirementType;
        this.weight = weight;
    }

    @PrePersist
    void onCreate() {
        Instant now = Instant.now();
        this.createdAt = now;
        this.updatedAt = now;
    }

    @PreUpdate
    void onUpdate() {
        this.updatedAt = Instant.now();
    }

    public UUID getId() {
        return id;
    }

    public CareerRole getRole() {
        return role;
    }

    public Skill getSkill() {
        return skill;
    }

    public RequirementType getRequirementType() {
        return requirementType;
    }

    public int getWeight() {
        return weight;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }

    public Instant getUpdatedAt() {
        return updatedAt;
    }
}
