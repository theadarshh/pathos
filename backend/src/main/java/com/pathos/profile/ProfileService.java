package com.pathos.profile;

import com.pathos.profile.dto.ProfileResponse;
import com.pathos.profile.dto.ProfileUpdateRequest;
import com.pathos.shared.ApiException;
import java.util.UUID;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class ProfileService {

    private final ProfileRepository profileRepository;

    public ProfileService(ProfileRepository profileRepository) {
        this.profileRepository = profileRepository;
    }

    @Transactional
    public Profile createEmptyProfile(UUID userId) {
        Profile profile = new Profile(userId);
        return profileRepository.save(profile);
    }

    @Transactional(readOnly = true)
    public ProfileResponse getProfile(UUID userId) {
        return ProfileResponse.from(findOwnProfileOrThrow(userId));
    }

    @Transactional
    public ProfileResponse updateProfile(UUID userId, ProfileUpdateRequest request) {
        Profile profile = findOwnProfileOrThrow(userId);
        profile.setRole(request.role());
        profile.setExperience(request.experience());
        profile.setSkills(request.skills());
        profile.setGoal(request.goal());
        profile.setComplete(request.complete());
        Profile saved = profileRepository.save(profile);
        return ProfileResponse.from(saved);
    }

    /**
     * Looks up the profile strictly by the authenticated user's own id —
     * never by a client-supplied profile id — so there is no path by which
     * one user's request can read or write another user's profile.
     */
    private Profile findOwnProfileOrThrow(UUID userId) {
        return profileRepository.findByUserId(userId)
            .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "PROFILE_NOT_FOUND", "No profile found for this account."));
    }
}
