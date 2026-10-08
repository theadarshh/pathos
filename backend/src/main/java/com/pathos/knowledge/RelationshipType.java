package com.pathos.knowledge;

/**
 * A directed edge type between two skills in the skill graph.
 * PREREQUISITE_OF: learning the "from" skill is expected before the "to" skill.
 * RELATED_TO: the two skills commonly go together / reinforce each other.
 * TRANSFERABLE_TO: experience in the "from" skill carries over toward the "to" skill.
 */
public enum RelationshipType {
    PREREQUISITE_OF,
    RELATED_TO,
    TRANSFERABLE_TO
}
