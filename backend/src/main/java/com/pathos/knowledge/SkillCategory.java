package com.pathos.knowledge;

import jakarta.persistence.*;
import java.time.Instant;
import java.util.UUID;

/**
 * A grouping for canonical skills (e.g. "Cloud", "DevOps", "Data"). Plain
 * reference data — categories are never hardcoded into Java logic, only
 * read from this table (see KNOWLEDGE_MODEL.md).
 */
@Entity
@Table(name = "skill_categories")
public class SkillCategory {

    @Id
    @GeneratedValue
    private UUID id;

    @Column(nullable = false, unique = true)
    private String name;

    private String description;

    @Column(nullable = false)
    private boolean active = true;

    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;

    @Column(name = "updated_at", nullable = false)
    private Instant updatedAt;

    protected SkillCategory() {
        // JPA
    }

    public SkillCategory(String name, String description) {
        this.name = name;
        this.description = description;
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

    public String getName() {
        return name;
    }

    public String getDescription() {
        return description;
    }

    public boolean isActive() {
        return active;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }

    public Instant getUpdatedAt() {
        return updatedAt;
    }
}
