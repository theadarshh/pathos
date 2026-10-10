package com.pathos.knowledge;

import jakarta.persistence.*;
import java.time.Instant;
import java.util.UUID;

/**
 * A single curated learning resource, optionally tied to a canonical
 * skill. Deliberately not a recommendation marketplace or a scraped
 * catalog — a small, hand-picked set (see V7 seed migration).
 */
@Entity
@Table(name = "learning_resources")
public class LearningResource {

    @Id
    @GeneratedValue
    private UUID id;

    @Column(nullable = false)
    private String title;

    private String provider;

    @Column(nullable = false, unique = true)
    private String url;

    @Enumerated(EnumType.STRING)
    @Column(name = "resource_type", nullable = false)
    private ResourceType resourceType;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "skill_id")
    private Skill skill;

    @Enumerated(EnumType.STRING)
    private ResourceDifficulty difficulty;

    @Column(nullable = false)
    private boolean active = true;

    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;

    @Column(name = "updated_at", nullable = false)
    private Instant updatedAt;

    protected LearningResource() {
        // JPA
    }

    public LearningResource(String title, String provider, String url, ResourceType resourceType, Skill skill, ResourceDifficulty difficulty) {
        this.title = title;
        this.provider = provider;
        this.url = url;
        this.resourceType = resourceType;
        this.skill = skill;
        this.difficulty = difficulty;
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

    public String getTitle() {
        return title;
    }

    public String getProvider() {
        return provider;
    }

    public String getUrl() {
        return url;
    }

    public ResourceType getResourceType() {
        return resourceType;
    }

    public Skill getSkill() {
        return skill;
    }

    public ResourceDifficulty getDifficulty() {
        return difficulty;
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
