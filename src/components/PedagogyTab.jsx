import pedagogy from '../data/pedagogy.js';

export default function PedagogyTab() {
  return (
    <div>
      <h2>Design rationale</h2>
      <p>This explainer applies evidence-based learning science principles.</p>

      {pedagogy.map((item) => (
        <div className="topic-group" key={item.principle}>
          <h3 className="topic-label">{item.principle}</h3>
          <p><strong>{item.claim}</strong></p>
          <p>{item.rationale}</p>
          <ul>
            {item.sources.map((s) => (
              <li className="source-item" key={s.link}>
                {s.authors} ({s.year}). <em>{s.title}</em>. {s.venue}.{' '}
                <a href={s.link} target="_blank" rel="noreferrer">{s.link}</a>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
