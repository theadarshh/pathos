import React from 'react';
import { buildProject } from '../../utils/projectBuilder.js';
import './project.css';

export default function ProjectBuilder({ profile, targetPath }) {
  const project = targetPath ? buildProject(targetPath, profile.skills) : null;

  return (
    <section className="view on">
      <div className="vhead">
        <div className="eyebrow">PROJECT BUILDER</div>
        <h2>Build something that proves it.</h2>
        <p>A project concept generated from {targetPath || 'your target path'}, your current skills, and the gap between them.</p>
      </div>

      {!project ? (
        <div className="card pb-empty">Explore a career path first — Project Builder generates a concept from it.</div>
      ) : (
        <div className="pb-workspace">
          <div className="pb-zone pb-identity">
            <span className={`pb-badge pb-badge-${project.difficulty.split('-')[0].toLowerCase()}`}>{project.difficulty}</span>
            <h3>{project.title}</h3>
            <p className="pb-summary">{project.summary}</p>
            <p className="pb-value"><small>PORTFOLIO SIGNAL</small>{project.portfolioValue}</p>
          </div>

          <div className="pb-zone pb-architecture">
            <small>ARCHITECTURE</small>
            <div className="pb-flow">
              {project.architecture.map((node, i) => (
                <React.Fragment key={node}>
                  <div className="pb-flow-node">{node}</div>
                  {i < project.architecture.length - 1 && <span className="pb-arrow">→</span>}
                </React.Fragment>
              ))}
            </div>
          </div>

          <div className="pb-zone pb-side">
            <small>SKILLS DEMONSTRATED</small>
            <div className="pb-pills">
              {project.demonstrates.map((s) => (
                <span key={s} className={`pb-pill ${project.known.includes(s) ? 'known' : 'gap'}`}>{s}</span>
              ))}
            </div>
            <small>MILESTONES</small>
            <ol className="pb-milestones">
              {project.milestones.map((m, i) => <li key={i}>{m}</li>)}
            </ol>
          </div>
        </div>
      )}
    </section>
  );
}
