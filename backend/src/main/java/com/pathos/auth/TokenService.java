package com.pathos.auth;

import java.util.UUID;

/**
 * Isolates token handling from business logic (AuthService never touches a
 * JWT library directly). Swapping JWT for opaque server-side sessions, or
 * adding OAuth later, means implementing this interface differently — the
 * auth/profile domain code never changes.
 */
public interface TokenService {

    String issueToken(UUID userId, String email);

    /**
     * @return the authenticated user's id
     * @throws InvalidTokenException if the token is missing, malformed, expired, or tampered with
     */
    UUID validateAndGetUserId(String token);
}
