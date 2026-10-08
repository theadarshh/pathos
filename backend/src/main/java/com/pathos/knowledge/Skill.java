package com.pathos.knowledge;

import com.pathos.shared.StringListConverter;
import jakarta.persistence.*;
import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.Locale;
import java.util.UUID;

/**
 * A canonical skill. {@code canonicalName} is the normalized (trimmed,
 * lowercased) form of {@code name}, computed here rather than trusted from
 * a caller, and is what {@link SkillNormalizationService} matches
 * free-text profile skill strings against.
 *
 * <p>This table deliberately does NOT accept arbitrary user-entered skill
 * strings as new rows — only seed data / future admin tooling creates
 * Skill records. A user's own profile skill text is a separate concept
 * (an unmapped "claim"), not a canonical Skill — see
 * {@link SkillNormalizationService} for how the two are distinguished.
 */
@Entity
@Table(name = "skills")
public class Skill {

    @Id
    @GeneratedValue
    private UUID id;

    @Column(nullable = false)
    private String name;

    @Column(name = "canonical_name", nullable = false, unique = true)
    private String canonicalName;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "category_id")
    private SkillCategory category;

    private String description;

    @Convert(converter = StringListConverter.class)
    @Column(nullable = false)
    private List<String> aliases = new ArrayList<>();

    @Column(nullable = false)
    private boolean active = true;

    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;

    @Column(name = "updated_at", nullable = false)
    private Instant updatedAt;

    protected Skill() {
        // JPA
    }

    public Skill(String name, SkillCategory category, String description) {
        this.name = name;
        this.canonicalName = normalize(name);
        this.category = category;
        this.description = description;
    }

    /** Trim + lowercase — the single normalization rule used everywhere a skill name is matched. */
    public static String normalize(String rawName) {
        return rawName == null ? "" : rawName.trim().toLowerCase(Locale.ROOT);
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

    public SkillCategory getCategory() {
        return category;
    }

    public String getDescription() {
        return description;
    }

    public List<String> getAliases() {
        return aliases;
    }

    public void setAliases(List<String> aliases) {
        this.aliases = aliases == null ? new ArrayList<>() : new ArrayList<>(aliases);
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
