import { useEffect, useState } from 'react';
import { getCareerPaths } from '../api/knowledgeApi.js';

/**
 * Fetches the V2.1 career-knowledge API's role descriptions once, keyed
 * by path name so existing V1 components (which already key everything
 * off the path label, e.g. "DevOps Engineer") can look a description up
 * with no change to how paths are identified elsewhere.
 *
 * This is purely additive: V1's hardcoded src/data/careerPaths.js stays
 * the source of truth for scoring/core-next-later skills (untouched —
 * see src/utils/scoring.js). If the backend is unreachable or returns an
 * error, `descriptions` just stays empty and callers render exactly as
 * V1 always did, with no description line. Nothing here can break the
 * app when the knowledge API is temporarily unavailable.
 */
export function useCareerKnowledge() {
  const [descriptions, setDescriptions] = useState({});
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    let cancelled = false;
    getCareerPaths()
      .then((roles) => {
        if (cancelled) return;
        const byName = {};
        for (const role of roles) {
          byName[role.name] = role.description;
        }
        setDescriptions(byName);
      })
      .catch(() => {
        // Backend unreachable or erroring -- stay silent, V1 behavior
        // (no description shown) is a perfectly fine fallback.
      })
      .finally(() => {
        if (!cancelled) setLoaded(true);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return { descriptions, loaded };
}
