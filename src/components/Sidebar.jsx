import React from 'react';

export default function Sidebar({ modules, activeModule, setActiveModule, arcFilter, setArcFilter }) {
  const mechanisticModules = modules.filter(m => m.arc === 'mechanistic');
  const meaningModules = modules.filter(m => m.arc === 'meaning');

  const showMechanistic = arcFilter === 'all' || arcFilter === 'mechanistic';
  const showMeaning = arcFilter === 'all' || arcFilter === 'meaning';

  return (
    <div className="sidebar">
      <div className="arc-filter">
        <button onClick={() => setArcFilter('all')} className={arcFilter === 'all' ? 'active' : ''}>
          All
        </button>
        <button onClick={() => setArcFilter('mechanistic')} className={arcFilter === 'mechanistic' ? 'active' : ''}>
          How it works
        </button>
        <button onClick={() => setArcFilter('meaning')} className={arcFilter === 'meaning' ? 'active' : ''}>
          What it means
        </button>
      </div>

      {showMechanistic && (
        <div>
          <div className="arc-header">How it works</div>
          {mechanisticModules.map(module => (
            <div
              key={module.slug}
              className={`nav-item${module.slug === activeModule ? ' active' : ''}`}
              onClick={() => setActiveModule(module.slug)}
            >
              {module.tab}{module.draft && <span> (draft)</span>}
            </div>
          ))}
        </div>
      )}

      {showMeaning && (
        <div>
          <div className="arc-header">What it means</div>
          {meaningModules.map(module => (
            <div
              key={module.slug}
              className={`nav-item${module.slug === activeModule ? ' active' : ''}`}
              onClick={() => setActiveModule(module.slug)}
            >
              {module.tab}{module.draft && <span> (draft)</span>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
