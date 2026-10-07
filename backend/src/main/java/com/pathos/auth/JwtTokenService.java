package com.pathos.auth;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import java.nio.charset.StandardCharsets;
import java.security.Key;
import java.time.Instant;
import java.util.Date;
import java.util.UUID;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

/**
 * The ONLY class in the codebase that imports a JWT library. Everything
 * else depends on {@link TokenService}.
 */
@Service
public class JwtTokenService implements TokenService {

    private final Key signingKey;
    private final long expirationMinutes;

    public JwtTokenService(
        @Value("${pathos.jwt.secret}") String secret,
        @Value("${pathos.jwt.expiration-minutes}") long expirationMinutes
    ) {
        if (secret == null || secret.getBytes(StandardCharsets.UTF_8).length < 32) {
            throw new IllegalStateException(
                "pathos.jwt.secret must be set and at least 32 bytes long. "
                    + "Set the JWT_SECRET environment variable — see .env.example.");
        }
        this.signingKey = Keys.hmacShaKeyFor(secret.getBytes(StandardCharsets.UTF_8));
        this.expirationMinutes = expirationMinutes;
    }

    @Override
    public String issueToken(UUID userId, String email) {
        Instant now = Instant.now();
        return Jwts.builder()
            .subject(userId.toString())
            .claim("email", email)
            .issuedAt(Date.from(now))
            .expiration(Date.from(now.plusSeconds(expirationMinutes * 60)))
            .signWith(signingKey)
            .compact();
    }

    @Override
    public UUID validateAndGetUserId(String token) {
        try {
            Claims claims = Jwts.parser()
                .verifyWith((javax.crypto.SecretKey) signingKey)
                .build()
                .parseSignedClaims(token)
                .getPayload();
            return UUID.fromString(claims.getSubject());
        } catch (ExpiredJwtException e) {
            throw new InvalidTokenException("Token has expired.", e);
        } catch (JwtException | IllegalArgumentException e) {
            throw new InvalidTokenException("Token is invalid.", e);
        }
    }
}
