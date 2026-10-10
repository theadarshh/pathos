package com.pathos.shared;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;
import java.util.ArrayList;
import java.util.List;

/**
 * Generic JSON-array-in-a-TEXT-column converter for {@code List<String>}
 * fields. Same representation/behavior as the V2.0
 * {@code com.pathos.profile.SkillListConverter} (kept as-is, untouched,
 * so existing Profile data/migrations are not affected) — factored out
 * here so new V2.1 entities (e.g. Skill.aliases) can reuse it without
 * depending on the profile package.
 */
@Converter
public class StringListConverter implements AttributeConverter<List<String>, String> {

    private static final ObjectMapper MAPPER = new ObjectMapper();
    private static final TypeReference<List<String>> LIST_TYPE = new TypeReference<>() {};

    @Override
    public String convertToDatabaseColumn(List<String> attribute) {
        try {
            return MAPPER.writeValueAsString(attribute == null ? List.of() : attribute);
        } catch (Exception e) {
            throw new IllegalStateException("Failed to serialize string list", e);
        }
    }

    @Override
    public List<String> convertToEntityAttribute(String dbData) {
        if (dbData == null || dbData.isBlank()) {
            return new ArrayList<>();
        }
        try {
            return new ArrayList<>(MAPPER.readValue(dbData, LIST_TYPE));
        } catch (Exception e) {
            throw new IllegalStateException("Failed to deserialize string list", e);
        }
    }
}
