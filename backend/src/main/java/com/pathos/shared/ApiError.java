package com.pathos.shared;

import java.time.Instant;
import java.util.List;

/**
 * Uniform error shape for every non-2xx response. Never carries a stack
 * trace or raw exception message to the client.
 */
public record ApiError(
    Instant timestamp,
    int status,
    String code,
    String message,
    List<String> details
) {
    public static ApiError of(int status, String code, String message) {
        return new ApiError(Instant.now(), status, code, message, List.of());
    }

    public static ApiError of(int status, String code, String message, List<String> details) {
        return new ApiError(Instant.now(), status, code, message, details);
    }
}
