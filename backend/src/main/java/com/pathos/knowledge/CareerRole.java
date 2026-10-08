package com.pathos.knowledge;

import jakarta.persistence.*;
import java.time.Instant;
import java.util.Locale;
import java.util.UUID;

/**
 * A persistent career path (was a hardcoded entry in V1's
 * src/data/careerPaths.js). "domain" is a free-text label (e.g. "DevOps",
 * "Cloud") — deliberately not a FK to {@link SkillCategory}, since a
 * role's domain and a skill's category are different classifications.
 */
@Entity
@Table(name = "career_roles")
public class CareerRole {

    @Id
    @GeneratedValue
    private UUID id;

    @Column(nullable = false)
    private String name;

    @Column(name = "canonical_name", nullable = false, unique = true)
    private String canonicalName;

    private String description;

    private String domain;

    @Column(nullable = false)
    private boolean active = true;

    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;

    @Column(name = "updated_at", nullable = false)
    private Instant updatedAt;

    protected CareerRole() {
        // JPA
    }

    public CareerRole(String name, String description, String domain) {
        this.name = name;
        this.canonicalName = name == null ? "" : name.trim().toLowerCase(Locale.ROOT);
        this.description = description;
        this.domain = domain;
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

    public String getCanonicalName() {
        return canonicalName;
    }

    public String getDescription() {
        return description;
    }

    public String getDomain() {
        return domain;
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
