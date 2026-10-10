package com.pathos.auth;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

import java.util.UUID;
import org.junit.jupiter.api.Test;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

/**
 * Focused unit tests for the two security-critical building blocks, with
 * no Spring context and no database — fast, and isolates the hashing/token
 * guarantees from the HTTP-level flow tests.
 */
class SecurityComponentsTest {

    @Test
    void passwordHashIsNotThePlaintextAndVerifiesCorrectly() {
        var encoder = new BCryptPasswordEncoder();
        String raw = "correct-horse-battery";

        String hash = encoder.encode(raw);

        assertThat(hash).isNotEqualTo(raw);
        assertThat(hash).startsWith("$2"); // BCrypt hash prefix
        assertThat(encoder.matches(raw, hash)).isTrue();
        assertThat(encoder.matches("wrong-password", hash)).isFalse();
    }

    @Test
    void sameePasswordHashedTwiceProducesDifferentHashes() {
        // BCrypt salts automatically -- two hashes of the same password must
        // differ, which is what stops a rainbow-table / equality-leak attack.
        var encoder = new BCryptPasswordEncoder();
        String raw = "correct-horse-battery";

        assertThat(encoder.encode(raw)).isNotEqualTo(encoder.encode(raw));
    }

    @Test
    void issuedTokenValidatesBackToTheSameUserId() {
        TokenService tokenService = new JwtTokenService(
            "test-only-secret-key-not-used-anywhere-real-32bytes-min", 60);
        UUID userId = UUID.randomUUID();

        String token = tokenService.issueToken(userId, "alice@example.com");

        assertThat(tokenService.validateAndGetUserId(token)).isEqualTo(userId);
    }

    @Test
    void tamperedTokenIsRejected() {
        TokenService tokenService = new JwtTokenService(
            "test-only-secret-key-not-used-anywhere-real-32bytes-min", 60);
        String token = tokenService.issueToken(UUID.randomUUID(), "alice@example.com");
        String tampered = token.substring(0, token.length() - 3) + "abc";

        assertThatThrownBy(() -> tokenService.validateAndGetUserId(tampered))
            .isInstanceOf(InvalidTokenException.class);
    }

    @Test
    void tokenSignedWithADifferentSecretIsRejected() {
        TokenService issuer = new JwtTokenService(
            "test-only-secret-key-not-used-anywhere-real-32bytes-min", 60);
        TokenService verifier = new JwtTokenService(
            "a-completely-different-secret-key-also-32-bytes-min", 60);

        String token = issuer.issueToken(UUID.randomUUID(), "alice@example.com");

        assertThatThrownBy(() -> verifier.validateAndGetUserId(token))
            .isInstanceOf(InvalidTokenException.class);
    }

    @Test
    void tooShortSecretIsRejectedAtConstruction() {
        assertThatThrownBy(() -> new JwtTokenService("too-short", 60))
            .isInstanceOf(IllegalStateException.class);
    }
}
