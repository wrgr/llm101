export default function Sidebar({ modules, activeModule, setActiveModule, arcFilter, setArcFilter }) {
  const mechanistic = modules.filter(m => m.arc === 'mechanistic')
  const meaning = modules.filter(m => m.arc === 'meaning')
  const showMech = arcFilter === 'all' || arcFilter === 'mechanistic'
  const showMean = arcFilter === 'all' || arcFilter === 'meaning'

  const NavItem = ({ module }) => (
    <div
      className={`nav-item${module.slug === activeModule ? ' active' : ''}`}
      onClick={() => setActiveModule(module.slug)}
    >
      <span className="nav-item-num">{module.num}</span>
      {module.tab}
    </div>
  )

  return (
    <div className="sidebar">
      <div className="arc-filter">
        <button className={`arc-btn${arcFilter === 'all' ? ' active' : ''}`} onClick={() => setArcFilter('all')}>All</button>
        <button className={`arc-btn${arcFilter === 'mechanistic' ? ' active' : ''}`} onClick={() => setArcFilter('mechanistic')}>Mechanism</button>
        <button className={`arc-btn${arcFilter === 'meaning' ? ' active' : ''}`} onClick={() => setArcFilter('meaning')}>Meaning</button>
      </div>

      {showMech && (
        <div className="arc-group">
          <div className="arc-header">How it works</div>
          {mechanistic.map(m => <NavItem key={m.slug} module={m} />)}
        </div>
      )}

      {showMean && (
        <div className="arc-group">
          <div className="arc-header">What it means</div>
          {meaning.map(m => <NavItem key={m.slug} module={m} />)}
        </div>
      )}
    </div>
  )
}
