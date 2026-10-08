package com.pathos.knowledge;

import jakarta.persistence.*;
import java.time.Instant;
import java.util.UUID;

/**
 * A directed edge in the skill graph (e.g. "Linux PREREQUISITE_OF Docker").
 * Pure PostgreSQL relational modeling — deliberately not a graph database
 * (see V2.1 scope: no Neo4j). Traversal, if ever needed beyond a single
 * hop, is ordinary recursive SQL / application-side graph walking over
 * this table, not a dedicated graph engine.
 */
@Entity
@Table(name = "skill_relationships")
public class SkillRelationship {

    @Id
    @GeneratedValue
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "from_skill_id", nullable = false)
    private Skill fromSkill;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "to_skill_id", nullable = false)
    private Skill toSkill;

    @Enumerated(EnumType.STRING)
    @Column(name = "relationship_type", nullable = false)
    private RelationshipType relationshipType;

    /** Strength of the edge, 1 (weak) – 10 (strong). */
    @Column(nullable = false)
    private int weight = 5;

    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;

    @Column(name = "updated_at", nullable = false)
    private Instant updatedAt;

    protected SkillRelationship() {
        // JPA
    }

    public SkillRelationship(Skill fromSkill, Skill toSkill, RelationshipType relationshipType, int weight) {
        this.fromSkill = fromSkill;
        this.toSkill = toSkill;
        this.relationshipType = relationshipType;
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

    public Skill getFromSkill() {
        return fromSkill;
    }

    public Skill getToSkill() {
        return toSkill;
    }

    public RelationshipType getRelationshipType() {
        return relationshipType;
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
