import { useState, useEffect, useRef, useCallback } from 'react'
import Header from '../components/Header.jsx'
import { NAV_MODULES } from '../router/index.jsx'
import TileGrid from '../components/TileGrid.jsx'

const MOD_ICONS = {
  operations: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4"/>
    </svg>
  ),
  inventory: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 3h18v5H3zM3 8h18v13H3z"/><path d="M9 13h6M9 17h4"/>
    </svg>
  ),
  quality: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>
    </svg>
  ),
  vendors: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/>
      <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/>
    </svg>
  ),
  reports: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6M16 13H8M16 17H8M10 9H8"/>
    </svg>
  ),
  planning: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/>
      <path d="M8 14h.01M12 14h.01M16 14h.01"/>
    </svg>
  ),
  analytics: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 3v18h18"/><path d="M7 16l4-4 3 3 5-6"/>
    </svg>
  ),
  default: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="18" height="18" rx="3"/><path d="M9 9h6M9 12h6M9 15h4"/>
    </svg>
  ),
}

function getIcon(modId = '') {
  const key = modId.toLowerCase()
  for (const k of Object.keys(MOD_ICONS)) {
    if (key.includes(k)) return MOD_ICONS[k]
  }
  return MOD_ICONS.default
}

const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --bg: #0e1017;
    --surface: #161a26;
    --ink: #edeae3;
    --ink2: #9096a8;
    --muted: #4a5060;
    --accent: #c8ff00;
    --border: rgba(255,255,255,0.06);
    --sidebar-w: 248px;
    --font-display: 'Syne', sans-serif;
    --font-body: 'DM Sans', sans-serif;
    --sb-bg: #0d0f1a;
    --sb-border: rgba(255,255,255,0.055);
    --sb-accent: #c8ff00;
    --sb-purple: #7b6cff;
    --sb-text: rgba(255,255,255,0.5);
    --sb-text-hi: #ffffff;
  }

  html, body, #root { height: 100%; overflow: hidden; }

  .ml-shell {
    display: flex;
    flex-direction: column;
    height: 100dvh;
    background: var(--bg);
    font-family: var(--font-body);
    overflow: hidden;
  }

  .ml-top { flex-shrink: 0; z-index: 200; }

  .ml-body { flex: 1; display: flex; min-height: 0; overflow: hidden; }

  /* ════════ SIDEBAR ════════ */
  .ml-sidebar {
    width: var(--sidebar-w);
    flex-shrink: 0;
    background: var(--sb-bg);
    display: flex;
    flex-direction: column;
    overflow: hidden;
    position: relative;
  }

  .ml-sb-dots {
    position: absolute;
    inset: 0;
    background-image: radial-gradient(rgba(255,255,255,0.055) 1px, transparent 1px);
    background-size: 18px 18px;
    pointer-events: none;
    z-index: 0;
  }

  .ml-sb-blob1 {
    position: absolute;
    top: -80px; left: -80px;
    width: 280px; height: 280px;
    background: radial-gradient(circle, rgba(123,108,255,0.22) 0%, transparent 68%);
    border-radius: 50%;
    pointer-events: none;
    z-index: 0;
    animation: blob-drift 9s ease-in-out infinite alternate;
  }

  .ml-sb-blob2 {
    position: absolute;
    bottom: 20px; right: -60px;
    width: 200px; height: 200px;
    background: radial-gradient(circle, rgba(200,255,0,0.11) 0%, transparent 68%);
    border-radius: 50%;
    pointer-events: none;
    z-index: 0;
    animation: blob-drift 7s ease-in-out 1.5s infinite alternate-reverse;
  }

  @keyframes blob-drift {
    from { transform: translate(0,0) scale(1); }
    to   { transform: translate(18px, 24px) scale(1.08); }
  }

  .ml-sb-head {
    position: relative;
    z-index: 1;
    padding: 22px 18px 18px;
    border-bottom: 1px solid var(--sb-border);
    flex-shrink: 0;
  }

  .ml-sb-eyebrow {
    font-family: var(--font-display);
    font-size: 7.5px;
    font-weight: 700;
    letter-spacing: 0.3em;
    text-transform: uppercase;
    color: rgba(255,255,255,0.18);
    margin-bottom: 10px;
  }

  .ml-sb-wordmark {
    font-family: var(--font-display);
    font-size: 22px;
    font-weight: 800;
    color: #fff;
    letter-spacing: -0.03em;
    line-height: 1;
    margin-bottom: 3px;
  }

  .ml-sb-wordmark em {
    font-style: normal;
    color: var(--sb-accent);
  }

  .ml-sb-chips {
    display: flex;
    gap: 5px;
    flex-wrap: wrap;
  }

  .ml-sb-chip {
    font-family: var(--font-display);
    font-size: 8px;
    font-weight: 800;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    padding: 3px 8px;
    border-radius: 20px;
  }

  .ml-sb-chip-lime {
    background: rgba(200,255,0,0.13);
    color: var(--sb-accent);
    border: 1px solid rgba(200,255,0,0.22);
  }

  .ml-sb-chip-purple {
    background: rgba(123,108,255,0.13);
    color: #b0a8ff;
    border: 1px solid rgba(123,108,255,0.22);
  }

  .ml-sb-chip-gray {
    background: rgba(255,255,255,0.06);
    color: rgba(255,255,255,0.3);
    border: 1px solid rgba(255,255,255,0.08);
  }

  .ml-nav-scroll {
    flex: 1;
    overflow-y: auto;
    overflow-x: hidden;
    scrollbar-width: none;
    padding: 14px 10px 10px;
    position: relative;
    z-index: 1;
  }

  .ml-nav-scroll::-webkit-scrollbar { display: none; }

  .ml-nav-group {
    font-family: var(--font-display);
    font-size: 7px;
    font-weight: 700;
    letter-spacing: 0.28em;
    text-transform: uppercase;
    color: rgba(255,255,255,0.15);
    padding: 6px 8px 8px;
  }

  .ml-nav-item {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 8px 10px;
    cursor: pointer;
    border-radius: 10px;
    font-size: 12px;
    color: var(--sb-text);
    transition: color 0.15s, background 0.15s;
    user-select: none;
    -webkit-tap-highlight-color: transparent;
    margin-bottom: 2px;
    position: relative;
  }

  .ml-nav-item:hover {
    color: rgba(255,255,255,0.85);
    background: rgba(255,255,255,0.05);
  }

  .ml-nav-item.active {
    background: var(--sb-accent);
    color: #09100a;
    font-weight: 700;
    font-family: var(--font-display);
    letter-spacing: 0.005em;
  }

  .ml-nav-item.active::before {
    content: '';
    position: absolute;
    left: -10px;
    top: 8px;
    bottom: 8px;
    width: 3px;
    background: var(--sb-accent);
    border-radius: 0 3px 3px 0;
    box-shadow: 0 0 10px rgba(200,255,0,0.8), 0 0 20px rgba(200,255,0,0.3);
  }

  .ml-nav-icon {
    width: 30px;
    height: 30px;
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    background: rgba(255,255,255,0.06);
    color: rgba(255,255,255,0.38);
    transition: background 0.15s, color 0.15s, transform 0.2s;
  }

  .ml-nav-item:hover .ml-nav-icon {
    background: rgba(255,255,255,0.1);
    color: rgba(255,255,255,0.8);
    transform: scale(1.08);
  }

  .ml-nav-item.active .ml-nav-icon {
    background: rgba(0,0,0,0.16);
    color: #09100a;
    transform: scale(1.05) rotate(-4deg);
  }

  .ml-nav-label { flex: 1; }

  .ml-nav-badge {
    font-size: 9px;
    font-weight: 800;
    font-family: var(--font-display);
    letter-spacing: 0.04em;
    padding: 2px 6px;
    border-radius: 20px;
    background: rgba(255,255,255,0.07);
    color: rgba(255,255,255,0.28);
    flex-shrink: 0;
  }

  .ml-nav-item.active .ml-nav-badge {
    background: rgba(0,0,0,0.16);
    color: rgba(0,0,0,0.5);
  }

  .ml-sb-footer {
    flex-shrink: 0;
    position: relative;
    z-index: 1;
    border-top: 1px solid var(--sb-border);
    padding: 12px 18px;
    display: flex;
    align-items: center;
    gap: 9px;
  }

  .ml-sb-pulse {
    width: 7px;
    height: 7px;
    border-radius: 50%;
    background: #22c55e;
    flex-shrink: 0;
    box-shadow: 0 0 0 0 rgba(34,197,94,0.5);
    animation: pulse-ring 2.2s ease-in-out infinite;
  }

  @keyframes pulse-ring {
    0%   { box-shadow: 0 0 0 0 rgba(34,197,94,0.5); }
    60%  { box-shadow: 0 0 0 6px rgba(34,197,94,0); }
    100% { box-shadow: 0 0 0 0 rgba(34,197,94,0); }
  }

  .ml-sb-footer-info { flex: 1; }

  .ml-sb-footer-status {
    font-family: var(--font-display);
    font-size: 9px;
    font-weight: 700;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: rgba(255,255,255,0.22);
  }

  .ml-sb-footer-tag {
    font-size: 8px;
    color: rgba(255,255,255,0.1);
    letter-spacing: 0.06em;
    margin-top: 1px;
    font-family: var(--font-display);
  }

  /* ════════ CONTENT ════════ */
  .ml-scroll {
    flex: 1;
    overflow-y: auto;
    overflow-x: hidden;
    -webkit-overflow-scrolling: touch;
    scrollbar-width: thin;
    scrollbar-color: var(--border) transparent;
  }

  .ml-scroll::-webkit-scrollbar { width: 3px; }
  .ml-scroll::-webkit-scrollbar-track { background: transparent; }
  .ml-scroll::-webkit-scrollbar-thumb { background: var(--border); border-radius: 2px; }

  .ml-main {
    max-width: 1060px;
    margin: 0 auto;
    padding: 40px 32px 100px;
    display: flex;
    flex-direction: column;
    gap: 60px;
  }

  .ml-section { display: flex; flex-direction: column; gap: 20px; }

  .ml-section-head { display: flex; align-items: center; gap: 14px; }

  .ml-section-name {
    font-family: var(--font-display);
    font-size: 10.5px;
    font-weight: 700;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    color: var(--ink);
    white-space: nowrap;
  }

  .ml-section-rule { flex: 1; height: 1px; background: var(--border); }

  .ml-section-tag {
    font-size: 9.5px;
    font-weight: 700;
    font-family: var(--font-display);
    color: var(--muted);
    background: var(--border);
    padding: 2px 8px;
    border-radius: 20px;
    letter-spacing: 0.06em;
  }

  /* ════════ MOBILE HAMBURGER ════════ */
  .ml-mobile-toggle { display: none; }
  .ml-sidebar-overlay { display: none; }
  .ml-sidebar-drawer { display: none; }
  .ml-mobile-nav { display: none; }

  @media (max-width: 768px) {
    .ml-sidebar { display: none; }

    .ml-mobile-toggle {
      display: flex;
      align-items: center;
      justify-content: center;
      position: fixed;
      top: 10px;
      left: 12px;
      z-index: 500;
      width: 36px;
      height: 36px;
      border-radius: 10px;
      background: var(--sb-bg);
      border: 1px solid var(--sb-border);
      color: rgba(255,255,255,0.7);
      cursor: pointer;
      -webkit-tap-highlight-color: transparent;
      transition: background 0.15s, color 0.15s;
    }

    .ml-mobile-toggle:active {
      background: rgba(200,255,0,0.12);
      color: var(--sb-accent);
    }

    .ml-sidebar-overlay {
      display: block;
      position: fixed;
      inset: 0;
      z-index: 399;
      background: rgba(0,0,0,0.55);
      backdrop-filter: blur(2px);
      opacity: 0;
      pointer-events: none;
      transition: opacity 0.25s ease;
    }

    .ml-sidebar-overlay.open {
      opacity: 1;
      pointer-events: all;
    }

    .ml-sidebar-drawer {
      display: flex;
      flex-direction: column;
      position: fixed;
      top: 0; left: 0; bottom: 0;
      width: var(--sidebar-w);
      z-index: 400;
      background: var(--sb-bg);
      overflow: hidden;
      transform: translateX(-100%);
      transition: transform 0.28s cubic-bezier(0.4, 0, 0.2, 1);
      box-shadow: 4px 0 32px rgba(0,0,0,0.45);
    }

    .ml-sidebar-drawer.open { transform: translateX(0); }

    .ml-drawer-close {
      position: absolute;
      top: 14px; right: 14px;
      z-index: 10;
      width: 30px; height: 30px;
      border-radius: 8px;
      background: rgba(255,255,255,0.07);
      border: 1px solid rgba(255,255,255,0.1);
      color: rgba(255,255,255,0.5);
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      -webkit-tap-highlight-color: transparent;
      transition: background 0.15s, color 0.15s;
    }

    .ml-drawer-close:active {
      background: rgba(200,255,0,0.12);
      color: var(--sb-accent);
    }

    .ml-main { padding: 20px 14px 100px; gap: 40px; }
    .ml-section-name { font-size: 9.5px; }

    .ml-mobile-nav {
      display: flex;
      flex-shrink: 0;
      background: var(--sb-bg);
      border-top: 1px solid var(--sb-border);
      overflow-x: auto;
      scrollbar-width: none;
      -webkit-overflow-scrolling: touch;
      z-index: 100;
      padding: 0 6px;
      height: 58px;
      align-items: center;
      gap: 2px;
    }

    .ml-mobile-nav::-webkit-scrollbar { display: none; }

    .ml-mobile-tab {
      flex-shrink: 0;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 3px;
      height: 48px;
      padding: 0 12px;
      border-radius: 10px;
      cursor: pointer;
      border: none;
      background: transparent;
      -webkit-tap-highlight-color: transparent;
      transition: background 0.15s;
      position: relative;
    }

    .ml-mobile-tab:active { background: rgba(255,255,255,0.05); }

    .ml-mobile-tab-icon {
      display: flex;
      color: rgba(255,255,255,0.28);
      transition: color 0.15s, transform 0.2s;
    }

    .ml-mobile-tab.active .ml-mobile-tab-icon {
      color: var(--sb-accent);
      transform: scale(1.2) rotate(-6deg);
    }

    .ml-mobile-tab-label {
      font-size: 9px;
      font-weight: 700;
      font-family: var(--font-display);
      color: rgba(255,255,255,0.25);
      white-space: nowrap;
      letter-spacing: 0.03em;
      transition: color 0.15s;
    }

    .ml-mobile-tab.active .ml-mobile-tab-label { color: var(--sb-accent); }

    .ml-mobile-tab.active::after {
      content: '';
      position: absolute;
      top: 3px;
      left: 50%;
      transform: translateX(-50%);
      width: 18px;
      height: 2px;
      background: var(--sb-accent);
      border-radius: 0 0 3px 3px;
      box-shadow: 0 0 8px rgba(200,255,0,0.7);
    }
  }

  @media (max-width: 480px) {
    .ml-mobile-tab { padding: 0 9px; }
    .ml-mobile-tab-label { font-size: 8.5px; }
  }
`

function SidebarInner({ activeModule, onSelect, onClose }) {
  return (
    <>
      <div className="ml-sb-dots" />
      <div className="ml-sb-blob1" />
      <div className="ml-sb-blob2" />

      {onClose && (
        <button className="ml-drawer-close" onClick={onClose} aria-label="Close menu">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
        </button>
      )}

      <div className="ml-sb-head">
        <div className="ml-sb-eyebrow">Daikin SAP Portal</div>
        <div className="ml-sb-wordmark">Mod<em>ules</em></div>
        <div className="ml-sb-chips">
          <span className="ml-sb-chip ml-sb-chip-lime">● Live</span>
          <span className="ml-sb-chip ml-sb-chip-lime">DSAL</span>
        </div>
      </div>

      <div className="ml-nav-scroll">
        <div className="ml-nav-group">All Modules</div>
        {NAV_MODULES.map((mod) => (
          <div
            key={mod.id}
            className={`ml-nav-item${activeModule === mod.id ? ' active' : ''}`}
            onClick={() => onSelect(mod.id)}
          >
            <div className="ml-nav-icon">{getIcon(mod.id)}</div>
            <span className="ml-nav-label">{mod.label}</span>
            {mod.tiles?.length > 0 && (
              <span className="ml-nav-badge">{mod.tiles.length}</span>
            )}
          </div>
        ))}
      </div>

      <div className="ml-sb-footer">
        <div className="ml-sb-pulse" />
        <div className="ml-sb-footer-info">
          <div className="ml-sb-footer-status">System Online</div>
          <div className="ml-sb-footer-tag">Kunstocom · v2.0</div>
        </div>
      </div>
    </>
  )
}

export default function MainLayout() {
  const [activeModule, setActiveModule] = useState(NAV_MODULES[0]?.id)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const sectionRefs = useRef({})
  const scrollAreaRef = useRef(null)
  const isScrollingTo = useRef(false)
  const scrollTimer = useRef(null)

  useEffect(() => {
    const onResize = () => { if (window.innerWidth > 768) setDrawerOpen(false) }
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  useEffect(() => {
    document.body.style.overflow = drawerOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [drawerOpen])

  const getTopHeight = () => {
    const top = document.querySelector('.ml-top')
    return top ? top.offsetHeight : 56
  }

  useEffect(() => {
    const scrollArea = scrollAreaRef.current
    if (!scrollArea) return
    const visibleSections = new Set()

    const obs = new IntersectionObserver(
      (entries) => {
        if (isScrollingTo.current) return
        entries.forEach((e) => {
          const id = e.target.dataset.moduleId
          if (e.isIntersecting) visibleSections.add(id)
          else visibleSections.delete(id)
        })
        if (!visibleSections.size) return
        let topmost = null, topmostY = Infinity
        visibleSections.forEach((id) => {
          const el = sectionRefs.current[id]
          if (!el) return
          const y = el.getBoundingClientRect().top
          if (y < topmostY) { topmostY = y; topmost = id }
        })
        if (topmost) setActiveModule(topmost)
      },
      { root: scrollArea, rootMargin: '-60px 0px -25% 0px', threshold: 0 }
    )

    NAV_MODULES.forEach((mod) => {
      const el = sectionRefs.current[mod.id]
      if (el) { el.dataset.moduleId = mod.id; obs.observe(el) }
    })

    return () => obs.disconnect()
  }, [])

  const handleSelect = useCallback((id) => {
    const el = sectionRefs.current[id]
    const scrollArea = scrollAreaRef.current
    if (!el || !scrollArea) return
    setActiveModule(id)
    setDrawerOpen(false)
    isScrollingTo.current = true
    if (scrollTimer.current) clearTimeout(scrollTimer.current)
    const offset = getTopHeight() + 20
    const top =
      el.getBoundingClientRect().top -
      scrollArea.getBoundingClientRect().top +
      scrollArea.scrollTop - offset
    scrollArea.scrollTo({ top, behavior: 'smooth' })
    scrollTimer.current = setTimeout(() => { isScrollingTo.current = false }, 900)
  }, [])

  return (
    <>
      <style>{CSS}</style>
      <div className="ml-shell">

        <div className="ml-top">
          <Header />
        </div>

        <button
          className="ml-mobile-toggle"
          onClick={() => setDrawerOpen(true)}
          aria-label="Open menu"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="3" y1="6" x2="21" y2="6"/>
            <line x1="3" y1="12" x2="21" y2="12"/>
            <line x1="3" y1="18" x2="21" y2="18"/>
          </svg>
        </button>

        <div
          className={`ml-sidebar-overlay${drawerOpen ? ' open' : ''}`}
          onClick={() => setDrawerOpen(false)}
        />

        <aside className={`ml-sidebar-drawer${drawerOpen ? ' open' : ''}`}>
          <SidebarInner
            activeModule={activeModule}
            onSelect={handleSelect}
            onClose={() => setDrawerOpen(false)}
          />
        </aside>

        <div className="ml-body">
          <aside className="ml-sidebar">
            <SidebarInner activeModule={activeModule} onSelect={handleSelect} />
          </aside>

          <div className="ml-scroll" ref={scrollAreaRef}>
            <main className="ml-main">
              {NAV_MODULES.map((mod) => (
                <section
                  key={mod.id}
                  id={`section-${mod.id}`}
                  ref={(el) => (sectionRefs.current[mod.id] = el)}
                  className="ml-section"
                >
                  <div className="ml-section-head">
                    <span className="ml-section-name">{mod.label}</span>
                    <div className="ml-section-rule" />
                    {mod.tiles?.length > 0 && (
                      <span className="ml-section-tag">{mod.tiles.length}</span>
                    )}
                  </div>
                  <TileGrid tiles={mod.tiles} />
                </section>
              ))}
            </main>
          </div>
        </div>

        <nav className="ml-mobile-nav">
          {NAV_MODULES.map((mod) => (
            <button
              key={mod.id}
              className={`ml-mobile-tab${activeModule === mod.id ? ' active' : ''}`}
              onClick={() => handleSelect(mod.id)}
            >
              <span className="ml-mobile-tab-icon">{getIcon(mod.id)}</span>
              <span className="ml-mobile-tab-label">{mod.label}</span>
            </button>
          ))}
        </nav>

      </div>
    </>
  )
}