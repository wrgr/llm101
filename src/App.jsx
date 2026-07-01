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
import GlossaryTab from './components/GlossaryTab.jsx'
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

const TABS = [
  { id: 'content',   label: 'Content' },
  { id: 'glossary',  label: 'Glossary' },
  { id: 'reference', label: 'References' },
  { id: 'further',   label: 'Further Reading' },
  { id: 'pedagogy',  label: 'Pedagogy' },
]

const MOBILE_TABS = [
  { id: 'modules',   label: 'Modules',  icon: '☰',  drawer: true },
  { id: 'content',   label: 'Content',  icon: '✦' },
  { id: 'glossary',  label: 'Glossary', icon: '⊟' },
  { id: 'reference', label: 'Refs',     icon: '⊞' },
  { id: 'further',   label: 'Reading',  icon: '↗' },
]

export default function App() {
  const [level, setLevel] = useState(1)
  const [activeModule, setActiveModule] = useState('introduction')
  const [activeTab, setActiveTab] = useState('content')
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
          {TABS.map(({ id, label }) => (
            <button
              key={id}
              className={`topbar-tab${activeTab === id ? ' active' : ''}`}
              onClick={() => selectTab(id)}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <div className="main-area">
        <Sidebar
          modules={modules}
          activeModule={activeModule}
          setActiveModule={selectModule}
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
          {activeTab === 'glossary'  && <GlossaryTab />}
          {activeTab === 'reference' && <ReferenceTab modules={modules} />}
          {activeTab === 'further'   && <FurtherReadingTab userLevel={level} />}
          {activeTab === 'pedagogy'  && <PedagogyTab />}
        </div>
      </div>

      {/* Mobile: drawer for sidebar */}
      <MobileDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)}>
        <Sidebar
          modules={modules}
          activeModule={activeModule}
          setActiveModule={selectModule}
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
        {MOBILE_TABS.filter(t => !t.drawer).map(({ id, label, icon }) => (
          <button
            key={id}
            className={`mobile-nav-btn${activeTab === id && !drawerOpen ? ' active' : ''}`}
            onClick={() => selectTab(id)}
          >
            <span className="mobile-nav-icon">{icon}</span>
            {label}
          </button>
        ))}
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
