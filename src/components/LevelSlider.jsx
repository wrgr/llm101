import { LEVELS } from '../data/levels.js'

export default function LevelSlider({ level, setLevel }) {
  const current = LEVELS[level]

  return (
    <div className="level-slider-wrap">
      <div className="level-row">
        <span className="level-name">{current.name}</span>
        <span className="level-audience">{current.audience}</span>
      </div>
      <div className="level-dots">
        {LEVELS.map((l, i) => (
          <div
            key={l.id}
            className={`level-dot${i === level ? ' active' : ''}`}
            data-label={l.name}
            onClick={() => setLevel(i)}
            title={`${l.name} — ${l.audience}`}
          />
        ))}
      </div>
    </div>
  )
}
