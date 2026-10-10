package com.pathos.profile;

import com.pathos.profile.dto.ProfileResponse;
import com.pathos.profile.dto.ProfileUpdateRequest;
import jakarta.validation.Valid;
import java.util.UUID;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/profile")
public class ProfileController {

    private final ProfileService profileService;

    public ProfileController(ProfileService profileService) {
        this.profileService = profileService;
    }

    @GetMapping
    public ResponseEntity<ProfileResponse> getProfile(Authentication authentication) {
        UUID userId = currentUserId(authentication);
        return ResponseEntity.ok(profileService.getProfile(userId));
    }

    @PutMapping
    public ResponseEntity<ProfileResponse> updateProfile(
        Authentication authentication,
        @Valid @RequestBody ProfileUpdateRequest request
    ) {
        UUID userId = currentUserId(authentication);
        return ResponseEntity.ok(profileService.updateProfile(userId, request));
    }

    /**
     * The authenticated user's id comes ONLY from the verified JWT subject
     * (set as the Authentication's name by JwtAuthenticationFilter) —
     * never from a path variable, query parameter, or request body. There
     * is deliberately no endpoint shape that accepts a client-supplied
     * user/profile id for ownership purposes.
     */
    private UUID currentUserId(Authentication authentication) {
        return UUID.fromString(authentication.getName());
    }
}
