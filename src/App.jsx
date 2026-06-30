import { useState } from 'react'
import modules from './data/modules.js'
import { LEVELS } from './data/levels.js'
import glossary from './data/glossary.js'
import LevelSlider from './components/LevelSlider.jsx'
import Sidebar from './components/Sidebar.jsx'
import ModuleView from './components/ModuleView.jsx'
import ReferenceTab from './components/ReferenceTab.jsx'
import PedagogyTab from './components/PedagogyTab.jsx'
import GlossaryPopover from './components/GlossaryPopover.jsx'
import './index.css'

export default function App() {
  const [level, setLevel] = useState(1)
  const [activeModule, setActiveModule] = useState('introduction')
  const [activeTab, setActiveTab] = useState('content')
  const [arcFilter, setArcFilter] = useState('all')
  const [popover, setPopover] = useState(null)

  const activeModuleData = modules.find(m => m.slug === activeModule)

  const handleTermClick = (key, event) => {
    setPopover({ term: key, x: event.clientX, y: event.clientY })
  }

  return (
    <div className="app">
      <div className="topbar">
        <h1>How LLMs actually work</h1>
        <div className="tab-bar">
          <button
            className={activeTab === 'content' ? 'active' : ''}
            onClick={() => setActiveTab('content')}
          >
            Content
          </button>
          <button
            className={activeTab === 'reference' ? 'active' : ''}
            onClick={() => setActiveTab('reference')}
          >
            Reference
          </button>
          <button
            className={activeTab === 'pedagogy' ? 'active' : ''}
            onClick={() => setActiveTab('pedagogy')}
          >
            Pedagogy
          </button>
        </div>
      </div>

      <div className="main-area">
        <Sidebar
          modules={modules}
          activeModule={activeModule}
          setActiveModule={setActiveModule}
          arcFilter={arcFilter}
          setArcFilter={setArcFilter}
        />

        <div className="content-col">
          {activeTab === 'content' && (
            <div className="level-area">
              <LevelSlider level={level} setLevel={setLevel} />
              <ModuleView
                module={activeModuleData}
                level={level}
                onTermClick={handleTermClick}
              />
            </div>
          )}
          {activeTab === 'reference' && (
            <ReferenceTab modules={modules} />
          )}
          {activeTab === 'pedagogy' && (
            <PedagogyTab />
          )}
        </div>
      </div>

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
