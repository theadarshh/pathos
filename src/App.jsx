import React, { useState, useEffect, useCallback } from 'react';
import Hero from './components/Hero/Hero.jsx';
import Onboarding from './components/Onboarding/Onboarding.jsx';
import BuildingSequence from './components/BuildingSequence/BuildingSequence.jsx';
import Navigation from './components/Navigation/Navigation.jsx';
import CareerIdentity from './components/CareerIdentity/CareerIdentity.jsx';
import CareerUniverse from './components/CareerUniverse/CareerUniverse.jsx';
import SkillGap from './components/SkillGap/SkillGap.jsx';
import LearnNext from './components/LearnNext/LearnNext.jsx';
import ComparePaths from './components/ComparePaths/ComparePaths.jsx';
import Roadmap from './components/Roadmap/Roadmap.jsx';
import WhatIfSimulator from './components/WhatIfSimulator/WhatIfSimulator.jsx';
import ProjectBuilder from './components/ProjectBuilder/ProjectBuilder.jsx';
import CareerCoach from './components/CareerCoach/CareerCoach.jsx';
import CommandPalette from './components/CommandPalette/CommandPalette.jsx';
import { loadProfile, saveProfile, clearProfile } from './hooks/useLocalStorage.js';
import { relevantPaths } from './utils/scoring.js';
import { DEMO_PROFILE } from './data/demoProfile.js';

const SCREENS = { HERO: 'hero', ONBOARDING: 'onboarding', BUILDING: 'building', APP: 'app' };
const EMPTY_PROFILE = { role: null, experience: null, skills: [], goal: null, complete: false };

export default function App() {
  const stored = loadProfile();
  const [screen, setScreen] = useState(stored?.complete ? SCREENS.APP : SCREENS.HERO);
  const [profile, setProfile] = useState(stored || EMPTY_PROFILE);
  const [view, setView] = useState('identity');
  const [selectedPath, setSelectedPath] = useState(null);
  const [editing, setEditing] = useState(false);
  const [coachOpen, setCoachOpen] = useState(false);
  const [intelligence, setIntelligence] = useState(null);

  useEffect(() => {
    saveProfile(profile);
  }, [profile]);

  const startOnboarding = useCallback(() => {
    setEditing(false);
    setScreen(SCREENS.ONBOARDING);
  }, []);

  const editProfile = useCallback(() => {
    setEditing(true);
    setScreen(SCREENS.ONBOARDING);
  }, []);

  const finishOnboarding = useCallback((finalProfile) => {
    setProfile({ ...finalProfile, complete: true });
    setScreen(SCREENS.BUILDING);
  }, []);

  const onBuildComplete = useCallback(() => {
    setScreen(SCREENS.APP);
    setView('identity');
  }, []);

  const restart = useCallback(() => {
    clearProfile();
    setProfile(EMPTY_PROFILE);
    setSelectedPath(null);
    setIntelligence(null);
    setScreen(SCREENS.HERO);
  }, []);

  const loadDemo = useCallback(() => {
    setProfile({ ...DEMO_PROFILE, complete: true });
    setScreen(SCREENS.BUILDING);
  }, []);

  if (screen === SCREENS.HERO) {
    return <Hero onStart={startOnboarding} onLoadDemo={loadDemo} />;
  }

  if (screen === SCREENS.ONBOARDING) {
    return <Onboarding onComplete={finishOnboarding} initial={editing ? profile : null} />;
  }

  if (screen === SCREENS.BUILDING) {
    return <BuildingSequence onComplete={onBuildComplete} />;
  }

  const paths = relevantPaths(profile.skills);
  const activePath = selectedPath || intelligence?.targetPath || paths[0];

  return (
    <div className="app-shell">
      <Navigation active={view} onChange={setView} onRestart={restart} onEditProfile={editProfile} />
      <main className="main">
        {view === 'identity' && <CareerIdentity profile={profile} />}
        {view === 'universe' && (
          <CareerUniverse
            profile={profile}
            paths={paths}
            selectedPath={activePath}
            onSelectPath={setSelectedPath}
            onExplore={() => setView('learnnext')}
            onSeeSkillGap={() => setView('skillgap')}
          />
        )}
        {view === 'skillgap' && (
          <SkillGap profile={profile} targetPath={activePath} highlightSkill={intelligence?.next} />
        )}
        {view === 'learnnext' && <LearnNext profile={profile} targetPath={activePath} />}
        {view === 'compare' && <ComparePaths profile={profile} />}
        {view === 'roadmap' && <Roadmap profile={profile} />}
        {view === 'whatif' && <WhatIfSimulator profile={profile} />}
        {view === 'project' && <ProjectBuilder profile={profile} targetPath={activePath} />}
      </main>
      <CareerCoach
        profile={{ ...profile, selectedPath: activePath, relevantPathsList: paths }}
        open={coachOpen}
        onOpen={() => setCoachOpen(true)}
        onClose={() => setCoachOpen(false)}
        onAdvice={setIntelligence}
      />
      <CommandPalette
        onNavigate={setView}
        onAsk={() => setCoachOpen(true)}
        onEditProfile={editProfile}
        onRestart={restart}
      />
    </div>
  );
}
