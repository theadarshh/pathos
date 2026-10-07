package com.pathos.auth;

import com.pathos.auth.dto.AuthResponse;
import com.pathos.auth.dto.LoginRequest;
import com.pathos.auth.dto.RegisterRequest;
import com.pathos.profile.ProfileService;
import com.pathos.shared.ApiException;
import com.pathos.user.User;
import com.pathos.user.UserRepository;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final ProfileService profileService;
    private final PasswordEncoder passwordEncoder;
    private final TokenService tokenService;

    public AuthService(
        UserRepository userRepository,
        ProfileService profileService,
        PasswordEncoder passwordEncoder,
        TokenService tokenService
    ) {
        this.userRepository = userRepository;
        this.profileService = profileService;
        this.passwordEncoder = passwordEncoder;
        this.tokenService = tokenService;
    }

    @Transactional
    public AuthResponse register(RegisterRequest request) {
        String normalizedEmail = request.email().trim().toLowerCase();

        if (userRepository.existsByEmailIgnoreCase(normalizedEmail)) {
            throw new ApiException(HttpStatus.CONFLICT, "EMAIL_ALREADY_REGISTERED",
                "An account with this email already exists.");
        }

        String hash = passwordEncoder.encode(request.password());
        User user = userRepository.save(new User(normalizedEmail, hash));

        // Every user gets an empty Profile at registration, so profile
        // endpoints never have to special-case "no profile yet" — this
        // mirrors V1's EMPTY_PROFILE constant exactly.
        profileService.createEmptyProfile(user.getId());

        String token = tokenService.issueToken(user.getId(), user.getEmail());
        return new AuthResponse(token, user.getId(), user.getEmail());
    }

    @Transactional(readOnly = true)
    public AuthResponse login(LoginRequest request) {
        String normalizedEmail = request.email().trim().toLowerCase();

        User user = userRepository.findByEmailIgnoreCase(normalizedEmail)
            .orElseThrow(() -> new ApiException(HttpStatus.UNAUTHORIZED, "INVALID_CREDENTIALS", "Invalid email or password."));

        if (!passwordEncoder.matches(request.password(), user.getPasswordHash())) {
            throw new ApiException(HttpStatus.UNAUTHORIZED, "INVALID_CREDENTIALS", "Invalid email or password.");
        }

        String token = tokenService.issueToken(user.getId(), user.getEmail());
        return new AuthResponse(token, user.getId(), user.getEmail());
    }
}
