import { useState } from 'react';
import pedagogy from '../data/pedagogy.js';

const TOPIC_GROUPS = [
  {
    key: 'language-modeling',
    topic: 'Language modeling & scale',
    moduleNums: ['00', '01', '06'],
  },
  {
    key: 'architecture',
    topic: 'Architecture',
    moduleNums: ['02', '03', '04', '05'],
  },
  {
    key: 'alignment',
    topic: 'Alignment & prompting',
    moduleNums: ['07', '08'],
  },
  {
    key: 'meaning-arc',
    topic: 'Meaning arc',
    moduleNums: ['09', '10', '11', '12', '13', '14'],
  },
  {
    key: 'pedagogy',
    topic: 'Pedagogy & design',
    moduleNums: null, // special: from pedagogy data
  },
];

function deduplicate(sources) {
  const seen = new Set();
  return sources.filter((s) => {
    const key = `${s.title}||${s.year}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function getPedagogySources() {
  const sources = [];
  for (const entry of pedagogy) {
    if (Array.isArray(entry.sources)) {
      sources.push(...entry.sources);
    }
  }
  return deduplicate(sources);
}

function getGroupSources(group, modules) {
  if (group.moduleNums === null) {
    return getPedagogySources();
  }
  const sources = [];
  for (const mod of modules) {
    if (group.moduleNums.includes(mod.num) && Array.isArray(mod.sources)) {
      sources.push(...mod.sources);
    }
  }
  return deduplicate(sources);
}

function SourceItem({ source }) {
  return (
    <li className="source-item">
      <span className="source-authors">
        {source.authors} ({source.year}).{' '}
      </span>
      <span className="source-title">{source.title}. </span>
      <span className="source-venue">{source.venue}.</span>
      {source.link && (
        <>
          {' '}
          <a
            className="source-link"
            href={source.link}
            target="_blank"
            rel="noreferrer"
          >
            ↗
          </a>
        </>
      )}
    </li>
  );
}

function TopicGroup({ group, modules }) {
  const sources = getGroupSources(group, modules);
  if (sources.length === 0) return null;
  return (
    <div className="topic-group">
      <h3 className="topic-label">{group.topic}</h3>
      <ul>
        {sources.map((source, i) => (
          <SourceItem key={`${source.title}-${source.year}-${i}`} source={source} />
        ))}
      </ul>
    </div>
  );
}

export default function ReferenceTab({ modules }) {
  const [activeGroup, setActiveGroup] = useState('all');

  const visibleGroups =
    activeGroup === 'all'
      ? TOPIC_GROUPS
      : TOPIC_GROUPS.filter((g) => g.key === activeGroup);

  return (
    <div className="reference-tab">
      <div className="reference-filter">
        <button
          className={activeGroup === 'all' ? 'active' : ''}
          onClick={() => setActiveGroup('all')}
        >
          All
        </button>
        {TOPIC_GROUPS.map((g) => (
          <button
            key={g.key}
            className={activeGroup === g.key ? 'active' : ''}
            onClick={() => setActiveGroup(g.key)}
          >
            {g.topic}
          </button>
        ))}
      </div>
      <div className="reference-list">
        {visibleGroups.map((group) => (
          <TopicGroup key={group.key} group={group} modules={modules} />
        ))}
      </div>
    </div>
  );
}
