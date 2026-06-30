import { LEVELS } from '../data/levels.js';

export default function LevelSlider({ level, setLevel }) {
  const current = LEVELS[level];

  return (
    <div className="level-slider-wrap">
      <div className="level-slider-info">
        <span className="level-name">{current.name}</span>
        <span className="level-audience">{current.audience}</span>
      </div>
      <input
        type="range"
        min={0}
        max={4}
        step={1}
        value={level}
        onChange={e => setLevel(Number(e.target.value))}
        style={{ '--pct': (level / 4 * 100) + '%' }}
        className="level-slider"
      />
      <div className="level-dots">
        {LEVELS.map((l, i) => (
          <span
            key={l.id}
            className={`level-dot-label${i === level ? ' active' : ''}`}
            onClick={() => setLevel(i)}
          >
            {l.name}
          </span>
        ))}
      </div>
    </div>
  );
}
