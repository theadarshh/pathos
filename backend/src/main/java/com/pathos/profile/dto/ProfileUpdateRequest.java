package com.pathos.profile.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.Size;
import java.util.List;

public record ProfileUpdateRequest(
    @Size(max = 255, message = "Role must be 255 characters or fewer.")
    String role,

    @Min(value = 0, message = "Experience cannot be negative.")
    Integer experience,

    List<String> skills,

    @Size(max = 255, message = "Goal must be 255 characters or fewer.")
    String goal,

    boolean complete
) {}
