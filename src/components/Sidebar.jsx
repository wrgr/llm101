import { useState } from 'react'

export default function Sidebar({ modules, activeModule, setActiveModule }) {
  const [arcTab, setArcTab] = useState('mechanistic')

  const mechanistic = modules.filter(m => m.arc === 'mechanistic')
  const meaning = modules.filter(m => m.arc === 'meaning')
  const visible = arcTab === 'mechanistic' ? mechanistic : meaning

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
      <div className="sidebar-arc-tabs">
        <button
          className={`sidebar-arc-tab${arcTab === 'mechanistic' ? ' active' : ''}`}
          onClick={() => setArcTab('mechanistic')}
        >
          How it works
        </button>
        <button
          className={`sidebar-arc-tab${arcTab === 'meaning' ? ' active' : ''}`}
          onClick={() => setArcTab('meaning')}
        >
          What matters
        </button>
      </div>

      <div className="arc-group">
        {visible.map(m => <NavItem key={m.slug} module={m} />)}
      </div>
    </div>
  )
}
