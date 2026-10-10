package com.pathos.knowledge;

import jakarta.persistence.*;
import java.time.Instant;
import java.util.UUID;

/**
 * Knowledge about moving from one {@link CareerRole} to another —
 * difficulty and a short rationale, curated by hand. This does not
 * compute or recommend a transition dynamically; it's reference data a
 * later intelligence layer (V2.2+) can read.
 */
@Entity
@Table(name = "career_transitions")
public class CareerTransition {

    @Id
    @GeneratedValue
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "source_role_id", nullable = false)
    private CareerRole sourceRole;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "target_role_id", nullable = false)
    private CareerRole targetRole;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TransitionDifficulty difficulty;

    private String rationale;

    @Column(nullable = false)
    private boolean active = true;

    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;

    @Column(name = "updated_at", nullable = false)
    private Instant updatedAt;

    protected CareerTransition() {
        // JPA
    }

    public CareerTransition(CareerRole sourceRole, CareerRole targetRole, TransitionDifficulty difficulty, String rationale) {
        this.sourceRole = sourceRole;
        this.targetRole = targetRole;
        this.difficulty = difficulty;
        this.rationale = rationale;
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

    public CareerRole getSourceRole() {
        return sourceRole;
    }

    public CareerRole getTargetRole() {
        return targetRole;
    }

    public TransitionDifficulty getDifficulty() {
        return difficulty;
    }

    public String getRationale() {
        return rationale;
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
