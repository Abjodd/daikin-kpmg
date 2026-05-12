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
  @import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500;600&family=IBM+Plex+Sans:wght@300;400;500;600&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --accent:        #4338ca;
    --accent-hover:  #4f46e5;
    --accent-soft:   rgba(67,56,202,0.08);
    --accent-mid:    rgba(67,56,202,0.14);
    --accent-brd:    rgba(67,56,202,0.22);
    --bg:            #f5f6fa;
    --surface:       #ffffff;
    --surface-2:     #f0f1f8;
    --border:        rgba(67,56,202,0.09);
    --border-hard:   rgba(67,56,202,0.16);
    --ink:           #1e1b4b;
    --ink-2:         #4338ca;
    --muted:         #a5b4fc;
    --sidebar-w:     252px;
    --sb-bg:         #1e1b4b;
    --sb-bg-2:       #272466;
    --sb-scrollbar:  rgba(99,102,241,0.45);
    --sb-scrollbar-track: rgba(255,255,255,0.05);
    --mono: 'IBM Plex Mono', monospace;
    --sans: 'IBM Plex Sans', sans-serif;
  }

  html, body, #root { height: 100%; overflow: hidden; }

  .ml-shell {
    display: flex;
    flex-direction: column;
    height: 100dvh;
    background: var(--bg);
    font-family: var(--sans);
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
    box-shadow: 1px 0 0 rgba(255,255,255,0.04), 4px 0 24px rgba(0,0,0,0.18);
  }

  .ml-sb-dots {
    position: absolute;
    inset: 0;
    background-image: radial-gradient(rgba(165,180,252,0.06) 1px, transparent 1px);
    background-size: 22px 22px;
    pointer-events: none;
    z-index: 0;
  }

  .ml-sb-blob1 {
    position: absolute;
    top: -80px; left: -80px;
    width: 300px; height: 300px;
    background: radial-gradient(circle, rgba(99,102,241,0.18) 0%, transparent 65%);
    border-radius: 50%;
    pointer-events: none;
    z-index: 0;
    animation: blob-drift 10s ease-in-out infinite alternate;
  }

  .ml-sb-blob2 {
    position: absolute;
    bottom: -40px; right: -80px;
    width: 220px; height: 220px;
    background: radial-gradient(circle, rgba(139,92,246,0.12) 0%, transparent 65%);
    border-radius: 50%;
    pointer-events: none;
    z-index: 0;
    animation: blob-drift 8s ease-in-out 2s infinite alternate-reverse;
  }

  @keyframes blob-drift {
    from { transform: translate(0,0) scale(1); }
    to   { transform: translate(14px, 20px) scale(1.06); }
  }

  .ml-sb-head {
    position: relative;
    z-index: 1;
    padding: 24px 20px 18px;
    border-bottom: 1px solid rgba(165,180,252,0.08);
    flex-shrink: 0;
  }

  .ml-sb-eyebrow {
    font-family: var(--mono);
    font-size: 7.5px;
    font-weight: 600;
    letter-spacing: 0.26em;
    text-transform: uppercase;
    color: rgba(165,180,252,0.45);
    margin-bottom: 10px;
  }

  .ml-sb-wordmark {
    font-family: var(--sans);
    font-size: 19px;
    font-weight: 600;
    color: #fff;
    letter-spacing: -0.02em;
    line-height: 1;
    margin-bottom: 14px;
  }

  .ml-sb-wordmark em {
    font-style: normal;
    color: rgba(165,180,252,0.6);
    font-weight: 300;
  }

  .ml-sb-chips {
    display: flex;
    gap: 6px;
    flex-wrap: wrap;
  }

  .ml-sb-chip {
    font-family: var(--mono);
    font-size: 8px;
    font-weight: 600;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    padding: 3px 9px;
    border-radius: 4px;
  }

  .ml-sb-chip-white {
    background: rgba(99,102,241,0.25);
    color: rgba(199,210,254,0.95);
    border: 1px solid rgba(99,102,241,0.35);
  }

  .ml-sb-chip-outline {
    background: transparent;
    color: rgba(165,180,252,0.5);
    border: 1px solid rgba(165,180,252,0.15);
  }

  /* ── Sidebar scrollbar — always visible, themed ── */
  .ml-nav-scroll {
    flex: 1;
    overflow-y: scroll;
    overflow-x: hidden;
    padding: 16px 12px 12px;
    position: relative;
    z-index: 1;
    /* Firefox */
    scrollbar-width: thin;
    scrollbar-color: var(--sb-scrollbar) var(--sb-scrollbar-track);
  }

  /* Webkit — custom track + thumb */
  .ml-nav-scroll::-webkit-scrollbar {
    width: 5px;
  }
  .ml-nav-scroll::-webkit-scrollbar-track {
    background: rgba(255,255,255,0.04);
    border-radius: 4px;
    margin: 4px 0;
  }
  .ml-nav-scroll::-webkit-scrollbar-thumb {
    background: rgba(99,102,241,0.55);
    border-radius: 4px;
  }
  .ml-nav-scroll::-webkit-scrollbar-thumb:hover {
    background: rgba(129,140,248,0.8);
  }

  .ml-nav-group {
    font-family: var(--mono);
    font-size: 7px;
    font-weight: 600;
    letter-spacing: 0.26em;
    text-transform: uppercase;
    color: rgba(165,180,252,0.28);
    padding: 6px 8px 10px;
  }

  .ml-nav-item {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 9px 10px;
    cursor: pointer;
    border-radius: 8px;
    font-size: 12.5px;
    font-family: var(--sans);
    color: rgba(199,210,254,0.55);
    transition: color 0.15s, background 0.15s;
    user-select: none;
    -webkit-tap-highlight-color: transparent;
    margin-bottom: 2px;
    position: relative;
  }

  .ml-nav-item:hover {
    color: rgba(255,255,255,0.88);
    background: rgba(165,180,252,0.08);
  }

  .ml-nav-item.active {
    background: rgba(99,102,241,0.22);
    color: #ffffff;
    font-weight: 500;
  }

  .ml-nav-item.active::before {
    content: '';
    position: absolute;
    left: -12px;
    top: 9px;
    bottom: 9px;
    width: 3px;
    background: #a5b4fc;
    border-radius: 0 3px 3px 0;
  }

  .ml-nav-icon {
    width: 30px;
    height: 30px;
    border-radius: 7px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    background: rgba(165,180,252,0.07);
    color: rgba(165,180,252,0.5);
    transition: background 0.15s, color 0.15s, transform 0.2s;
  }

  .ml-nav-item:hover .ml-nav-icon {
    background: rgba(165,180,252,0.13);
    color: rgba(199,210,254,0.9);
    transform: scale(1.07);
  }

  .ml-nav-item.active .ml-nav-icon {
    background: rgba(99,102,241,0.3);
    color: #c7d2fe;
  }

  .ml-nav-label { flex: 1; }

  .ml-nav-badge {
    font-family: var(--mono);
    font-size: 9px;
    font-weight: 500;
    letter-spacing: 0.06em;
    padding: 2px 7px;
    border-radius: 4px;
    background: rgba(165,180,252,0.08);
    color: rgba(165,180,252,0.4);
    flex-shrink: 0;
    border: 1px solid rgba(165,180,252,0.1);
  }

  .ml-nav-item.active .ml-nav-badge {
    background: rgba(99,102,241,0.25);
    color: rgba(199,210,254,0.8);
    border-color: rgba(99,102,241,0.3);
  }

  .ml-sb-footer {
    flex-shrink: 0;
    position: relative;
    z-index: 1;
    border-top: 1px solid rgba(165,180,252,0.08);
    padding: 14px 20px;
    display: flex;
    align-items: center;
    gap: 10px;
    background: rgba(0,0,0,0.12);
  }

  .ml-sb-pulse {
    width: 7px;
    height: 7px;
    border-radius: 50%;
    background: #6ee7b7;
    flex-shrink: 0;
    box-shadow: 0 0 0 0 rgba(110,231,183,0.4);
    animation: pulse-ring 2.4s ease-in-out infinite;
  }

  @keyframes pulse-ring {
    0%   { box-shadow: 0 0 0 0 rgba(110,231,183,0.4); }
    60%  { box-shadow: 0 0 0 6px rgba(110,231,183,0); }
    100% { box-shadow: 0 0 0 0 rgba(110,231,183,0); }
  }

  .ml-sb-footer-info { flex: 1; }

  .ml-sb-footer-status {
    font-family: var(--mono);
    font-size: 9px;
    font-weight: 600;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: rgba(199,210,254,0.45);
  }

  .ml-sb-footer-tag {
    font-family: var(--mono);
    font-size: 8px;
    color: rgba(165,180,252,0.22);
    letter-spacing: 0.06em;
    margin-top: 2px;
  }

  /* ════════ MAIN CONTENT SCROLL ════════ */
  .ml-scroll {
    flex: 1;
    overflow-y: auto;
    overflow-x: hidden;
    -webkit-overflow-scrolling: touch;
    scrollbar-width: thin;
    scrollbar-color: var(--border-hard) transparent;
  }

  .ml-scroll::-webkit-scrollbar { width: 4px; }
  .ml-scroll::-webkit-scrollbar-track { background: transparent; }
  .ml-scroll::-webkit-scrollbar-thumb {
    background: var(--border-hard);
    border-radius: 4px;
  }

  .ml-main {
    max-width: 1060px;
    margin: 0 auto;
    padding: 40px 32px 100px;
    display: flex;
    flex-direction: column;
    gap: 56px;
  }

  .ml-section { display: flex; flex-direction: column; gap: 18px; }

  .ml-section-head {
    display: flex;
    align-items: center;
    gap: 14px;
  }

  .ml-section-name {
    font-family: var(--mono);
    font-size: 10px;
    font-weight: 600;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    color: var(--accent);
    white-space: nowrap;
    opacity: 0.7;
  }

  .ml-section-rule {
    flex: 1;
    height: 1px;
    background: var(--border-hard);
  }

  .ml-section-tag {
    font-family: var(--mono);
    font-size: 9px;
    font-weight: 500;
    background: var(--surface);
    border: 1px solid var(--border-hard);
    padding: 2px 8px;
    border-radius: 4px;
    letter-spacing: 0.08em;
    color: var(--accent);
    opacity: 0.7;
  }

  /* ════════ MOBILE ════════ */
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
      border-radius: 8px;
      background: var(--sb-bg);
      border: none;
      color: #c7d2fe;
      cursor: pointer;
      -webkit-tap-highlight-color: transparent;
      transition: background 0.15s;
      box-shadow: 0 2px 10px rgba(0,0,0,0.25);
    }

    .ml-mobile-toggle:active { background: var(--sb-bg-2); }

    .ml-sidebar-overlay {
      display: block;
      position: fixed;
      inset: 0;
      z-index: 399;
      background: rgba(15,12,40,0.5);
      backdrop-filter: blur(3px);
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
      box-shadow: 4px 0 32px rgba(0,0,0,0.3);
    }

    .ml-sidebar-drawer.open { transform: translateX(0); }

    .ml-drawer-close {
      position: absolute;
      top: 14px; right: 14px;
      z-index: 10;
      width: 30px; height: 30px;
      border-radius: 7px;
      background: rgba(165,180,252,0.1);
      border: 1px solid rgba(165,180,252,0.15);
      color: rgba(199,210,254,0.65);
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      -webkit-tap-highlight-color: transparent;
      transition: background 0.15s, color 0.15s;
    }

    .ml-drawer-close:active {
      background: rgba(165,180,252,0.2);
      color: #ffffff;
    }

    .ml-main { padding: 20px 14px 80px; gap: 36px; }
    .ml-section-name { font-size: 9.5px; }

    .ml-mobile-nav {
      display: flex;
      flex-shrink: 0;
      background: var(--surface);
      border-top: 1px solid var(--border-hard);
      box-shadow: 0 -2px 12px rgba(67,56,202,0.08);
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
      border-radius: 8px;
      cursor: pointer;
      border: none;
      background: transparent;
      -webkit-tap-highlight-color: transparent;
      transition: background 0.15s;
      position: relative;
    }

    .ml-mobile-tab:active { background: var(--accent-soft); }

    .ml-mobile-tab-icon {
      display: flex;
      color: var(--muted);
      transition: color 0.15s, transform 0.2s;
    }

    .ml-mobile-tab.active .ml-mobile-tab-icon {
      color: var(--accent);
      transform: scale(1.18);
    }

    .ml-mobile-tab-label {
      font-family: var(--mono);
      font-size: 9px;
      font-weight: 500;
      color: var(--muted);
      white-space: nowrap;
      letter-spacing: 0.05em;
      transition: color 0.15s;
    }

    .ml-mobile-tab.active .ml-mobile-tab-label { color: var(--accent); }

    .ml-mobile-tab.active::after {
      content: '';
      position: absolute;
      top: 3px;
      left: 50%;
      transform: translateX(-50%);
      width: 18px;
      height: 2px;
      background: var(--accent);
      border-radius: 0 0 3px 3px;
    }
  }

  /* tablet — narrower sidebar */
  @media (min-width: 769px) and (max-width: 1024px) {
    :root { --sidebar-w: 210px; }
    .ml-main { padding: 28px 20px 80px; gap: 44px; }
    .ml-sb-head { padding: 18px 16px 14px; }
    .ml-sb-wordmark { font-size: 17px; }
  }

  @media (max-width: 480px) {
    .ml-mobile-tab { padding: 0 9px; }
    .ml-mobile-tab-label { font-size: 8.5px; }
    .ml-main { padding: 16px 10px 80px; gap: 30px; }
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
          <span className="ml-sb-chip ml-sb-chip-white">● Live</span>
          <span className="ml-sb-chip ml-sb-chip-outline">DSAL</span>
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