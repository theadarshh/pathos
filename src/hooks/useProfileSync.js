import { useState, useEffect, useCallback, useRef } from 'react';
import { loadProfile, saveProfile, clearProfile as clearLocalProfile } from './useLocalStorage.js';
import { getToken, clearToken } from '../api/client.js';
import { getProfile as fetchProfile, updateProfile as pushProfile } from '../api/profileApi.js';
import * as authApi from '../api/authApi.js';

// The four states the UI must be able to tell apart (per the V2.0 spec):
// OFFLINE = no backend session; everything is local-only, by design.
// SAVING  = a write to the backend is in flight.
// SAVED   = the backend confirmed the write (or the initial load).
// FAILED  = the backend rejected or could not confirm a write -- the
//           profile may be out of sync and the UI must say so, never SAVED.
export const SYNC_STATUS = {
  OFFLINE: 'offline',
  SAVING: 'saving',
  SAVED: 'saved',
  FAILED: 'failed',
};

function fromRemote(remote) {
  return {
    role: remote.role ?? null,
    experience: remote.experience ?? null,
    skills: remote.skills ?? [],
    goal: remote.goal ?? null,
    complete: !!remote.complete,
  };
}

/**
 * Backend-as-source-of-truth-when-authenticated, with localStorage as an
 * explicit, non-silent fallback. Every profile write is cached locally
 * (so the app keeps working offline) and, when a session token exists,
 * also pushed to the API -- the push's real outcome (not an assumption)
 * drives the SAVING/SAVED/FAILED/OFFLINE status the UI shows.
 */
export function useProfileSync(emptyProfile) {
  const [profile, setProfileState] = useState(() => loadProfile() || emptyProfile);
  const [status, setStatus] = useState(() => (getToken() ? SYNC_STATUS.SAVING : SYNC_STATUS.OFFLINE));
  const [authed, setAuthed] = useState(() => !!getToken());
  const [authEmail, setAuthEmail] = useState(null);

  // Guards the very first [profile] effect run (on mount, and right after
  // a remote hydration) so we don't immediately PUT back what we just GOT.
  const skipNextPush = useRef(true);

  const hydrateFromBackend = useCallback(async () => {
    setStatus(SYNC_STATUS.SAVING);
    try {
      const remote = await fetchProfile();
      skipNextPush.current = true;
      setProfileState(fromRemote(remote));
      setStatus(SYNC_STATUS.SAVED);
      return true;
    } catch (err) {
      if (err.offline) {
        setStatus(SYNC_STATUS.OFFLINE);
      } else if (err.status === 401) {
        // Token invalid/expired -- fall back to an honest, unauthenticated
        // local-only session rather than pretending we're still synced.
        clearToken();
        setAuthed(false);
        setStatus(SYNC_STATUS.OFFLINE);
      } else {
        setStatus(SYNC_STATUS.FAILED);
      }
      return false;
    }
  }, []);

  // On mount: if a session token is already present, the backend is the
  // source of truth -- pull it down before showing anything else.
  useEffect(() => {
    if (getToken()) hydrateFromBackend();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Every profile change is cached locally (cheap, synchronous, keeps the
  // app usable offline) and, only when authenticated, also pushed to the
  // backend -- whose actual response (not an assumption) sets the status.
  useEffect(() => {
    saveProfile(profile);

    if (skipNextPush.current) {
      skipNextPush.current = false;
      return undefined;
    }
    if (!getToken()) {
      setStatus(SYNC_STATUS.OFFLINE);
      return undefined;
    }

    let cancelled = false;
    setStatus(SYNC_STATUS.SAVING);
    pushProfile(profile)
      .then(() => {
        if (!cancelled) setStatus(SYNC_STATUS.SAVED);
      })
      .catch((err) => {
        if (cancelled) return;
        if (err.offline) {
          setStatus(SYNC_STATUS.OFFLINE);
        } else if (err.status === 401) {
          clearToken();
          setAuthed(false);
          setStatus(SYNC_STATUS.OFFLINE);
        } else {
          // The write did NOT land on the backend -- never report SAVED.
          setStatus(SYNC_STATUS.FAILED);
        }
      });
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profile]);

  const setProfile = useCallback((updater) => setProfileState(updater), []);

  const clear = useCallback(() => {
    clearLocalProfile();
  }, []);

  const register = useCallback(
    async (email, password) => {
      const { email: confirmedEmail } = await authApi.register(email, password);
      setAuthed(true);
      setAuthEmail(confirmedEmail);
      await hydrateFromBackend();
    },
    [hydrateFromBackend]
  );

  const login = useCallback(
    async (email, password) => {
      const { email: confirmedEmail } = await authApi.login(email, password);
      setAuthed(true);
      setAuthEmail(confirmedEmail);
      // The backend's profile for this account is authoritative on login --
      // it replaces whatever was sitting in localStorage beforehand.
      await hydrateFromBackend();
    },
    [hydrateFromBackend]
  );

  const logout = useCallback(() => {
    authApi.logout();
    setAuthed(false);
    setAuthEmail(null);
    setStatus(SYNC_STATUS.OFFLINE);
  }, []);

  return { profile, setProfile, clear, status, authed, authEmail, register, login, logout };
}
