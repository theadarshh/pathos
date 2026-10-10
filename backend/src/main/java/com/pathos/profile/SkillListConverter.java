package com.pathos.profile;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;
import java.util.List;

/**
 * Serializes the profile's skill list as a JSON array in a TEXT column.
 *
 * TEMPORARY, by design — see V2__create_profiles_table.sql. This is a
 * direct mirror of V1's in-memory `skills: string[]`, not the future
 * normalized skill graph (V2.1/V2.2).
 */
@Converter
public class SkillListConverter implements AttributeConverter<List<String>, String> {

    private static final ObjectMapper MAPPER = new ObjectMapper();
    private static final TypeReference<List<String>> LIST_TYPE = new TypeReference<>() {};

    @Override
    public String convertToDatabaseColumn(List<String> attribute) {
        try {
            return MAPPER.writeValueAsString(attribute == null ? List.of() : attribute);
        } catch (Exception e) {
            throw new IllegalStateException("Failed to serialize skills list", e);
        }
    }

    @Override
    public List<String> convertToEntityAttribute(String dbData) {
        if (dbData == null || dbData.isBlank()) {
            return List.of();
        }
        try {
            return MAPPER.readValue(dbData, LIST_TYPE);
        } catch (Exception e) {
            throw new IllegalStateException("Failed to deserialize skills list: " + dbData, e);
        }
    }
}
