package com.pathos.auth;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.List;
import java.util.UUID;
import org.springframework.lang.NonNull;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

/**
 * Reads `Authorization: Bearer <token>`, validates it via {@link TokenService}
 * (never parses the JWT itself — that stays isolated in JwtTokenService),
 * and sets the authenticated user's id as the Authentication's name. A
 * missing or invalid token simply leaves the SecurityContext unauthenticated;
 * SecurityConfig's authorization rules are what actually reject the request.
 */
@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final TokenService tokenService;

    public JwtAuthenticationFilter(TokenService tokenService) {
        this.tokenService = tokenService;
    }

    @Override
    protected void doFilterInternal(
        @NonNull HttpServletRequest request,
        @NonNull HttpServletResponse response,
        @NonNull FilterChain filterChain
    ) throws ServletException, IOException {
        String header = request.getHeader("Authorization");

        if (header != null && header.startsWith("Bearer ")) {
            String token = header.substring(7);
            try {
                UUID userId = tokenService.validateAndGetUserId(token);
                var authentication = new UsernamePasswordAuthenticationToken(
                    userId.toString(), null, List.of());
                SecurityContextHolder.getContext().setAuthentication(authentication);
            } catch (InvalidTokenException e) {
                // Leave the context unauthenticated; downstream authorization
                // rules reject the request with 401. Never throw here — a
                // bad token on a public endpoint (e.g. /api/auth/login) must
                // not break that endpoint.
                SecurityContextHolder.clearContext();
            }
        }

        filterChain.doFilter(request, response);
    }
}
