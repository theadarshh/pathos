package com.pathos.profile.dto;

import com.pathos.profile.Profile;
import java.util.List;

/** Never expose the JPA entity directly — this is the API-facing shape. */
public record ProfileResponse(
    String role,
    Integer experience,
    List<String> skills,
    String goal,
    boolean complete
) {
    public static ProfileResponse from(Profile profile) {
        return new ProfileResponse(
            profile.getRole(),
            profile.getExperience(),
            profile.getSkills(),
            profile.getGoal(),
            profile.isComplete()
        );
    }
}
