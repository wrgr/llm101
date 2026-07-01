import { useState } from 'react'
import modules from './data/modules.js'
import { LEVELS } from './data/levels.js'
import glossary from './data/glossary.js'
import LevelSlider from './components/LevelSlider.jsx'
import Sidebar from './components/Sidebar.jsx'
import ModuleView from './components/ModuleView.jsx'
import ReferenceTab from './components/ReferenceTab.jsx'
import PedagogyTab from './components/PedagogyTab.jsx'
import FurtherReadingTab from './components/FurtherReadingTab.jsx'
import GlossaryPopover from './components/GlossaryPopover.jsx'
import './index.css'

function MobileDrawer({ open, onClose, children }) {
  return (
    <>
      <div
        className={`mobile-drawer-backdrop${open ? ' open' : ''}`}
        onClick={onClose}
      />
      <div className={`mobile-drawer${open ? ' open' : ''}`}>
        <button className="mobile-drawer-close" onClick={onClose} aria-label="Close menu">✕</button>
        {children}
      </div>
    </>
  )
}

export default function App() {
  const [level, setLevel] = useState(1)
  const [activeModule, setActiveModule] = useState('introduction')
  const [activeTab, setActiveTab] = useState('content')
  const [arcFilter, setArcFilter] = useState('all')
  const [popover, setPopover] = useState(null)
  const [drawerOpen, setDrawerOpen] = useState(false)

  const activeModuleData = modules.find(m => m.slug === activeModule)

  const handleTermClick = (key, event) => {
    setPopover({ term: key, x: event.clientX, y: event.clientY })
  }

  const selectModule = (slug) => {
    setActiveModule(slug)
    setActiveTab('content')
    setDrawerOpen(false)
  }

  const selectTab = (tab) => {
    setActiveTab(tab)
    setDrawerOpen(false)
  }

  return (
    <div className="app">
      <div className="topbar">
        <div className="topbar-title">How <span>LLMs</span> actually work</div>
        <div className="topbar-tabs">
          {['content', 'reference', 'further', 'pedagogy'].map(tab => (
            <button
              key={tab}
              className={`topbar-tab${activeTab === tab ? ' active' : ''}`}
              onClick={() => selectTab(tab)}
            >
              {tab === 'further' ? 'Further Reading' : tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div className="main-area">
        <Sidebar
          modules={modules}
          activeModule={activeModule}
          setActiveModule={selectModule}
          arcFilter={arcFilter}
          setArcFilter={setArcFilter}
        />

        <div className="content-col">
          {activeTab === 'content' && (
            <>
              <div className="level-area">
                <LevelSlider level={level} setLevel={setLevel} />
              </div>
              <div className="content">
                <div className="content-inner">
                  <ModuleView
                    module={activeModuleData}
                    level={level}
                    onTermClick={handleTermClick}
                  />
                </div>
              </div>
            </>
          )}
          {activeTab === 'reference' && <ReferenceTab modules={modules} />}
          {activeTab === 'further' && <FurtherReadingTab userLevel={level} />}
          {activeTab === 'pedagogy' && <PedagogyTab />}
        </div>
      </div>

      {/* Mobile: drawer for sidebar */}
      <MobileDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)}>
        <Sidebar
          modules={modules}
          activeModule={activeModule}
          setActiveModule={selectModule}
          arcFilter={arcFilter}
          setArcFilter={setArcFilter}
        />
      </MobileDrawer>

      {/* Mobile: bottom nav bar */}
      <nav className="mobile-nav" role="navigation">
        <button
          className={`mobile-nav-btn${drawerOpen ? ' active' : ''}`}
          onClick={() => setDrawerOpen(o => !o)}
        >
          <span className="mobile-nav-icon">☰</span>
          Modules
        </button>
        <button
          className={`mobile-nav-btn${activeTab === 'content' && !drawerOpen ? ' active' : ''}`}
          onClick={() => selectTab('content')}
        >
          <span className="mobile-nav-icon">✦</span>
          Content
        </button>
        <button
          className={`mobile-nav-btn${activeTab === 'reference' && !drawerOpen ? ' active' : ''}`}
          onClick={() => selectTab('reference')}
        >
          <span className="mobile-nav-icon">⊞</span>
          Reference
        </button>
        <button
          className={`mobile-nav-btn${activeTab === 'further' && !drawerOpen ? ' active' : ''}`}
          onClick={() => selectTab('further')}
        >
          <span className="mobile-nav-icon">↗</span>
          Reading
        </button>
        <button
          className={`mobile-nav-btn${activeTab === 'pedagogy' && !drawerOpen ? ' active' : ''}`}
          onClick={() => selectTab('pedagogy')}
        >
          <span className="mobile-nav-icon">∿</span>
          Pedagogy
        </button>
      </nav>

      {popover && (
        <GlossaryPopover
          term={popover.term}
          glossary={glossary}
          position={{ x: popover.x, y: popover.y }}
          onClose={() => setPopover(null)}
        />
      )}
    </div>
  )
}
