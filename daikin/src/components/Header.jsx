import { useState, useRef, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { findModuleByTilePath, NAV_MODULES } from '../router/index.jsx'

const COMPANY = 'DSAL'
const COMPANY_FULL = 'Daikin Airconditioning India Pvt. Ltd.'
const SUPPLIER = 'Kunstocom (India) Ltd'
const LOCATION = 'Neemrana, Alwar'

const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500&display=swap');

  .hdr-root {
    --ink: #edeae3;
    --ink2: #9096a8;
    --muted: #4a5060;
    --accent: #c8ff00;
    --border: rgba(255,255,255,0.07);
    --bg: #0d0f1a;
    --surface: #161a26;
    --font-display: 'Syne', sans-serif;
    --font-body: 'DM Sans', sans-serif;

    position: sticky;
    top: 0;
    z-index: 200;
    height: 56px;
    background: var(--bg);
    border-bottom: 1px solid var(--border);
    display: flex;
    align-items: center;
    padding: 0 20px;
    gap: 0;
    font-family: var(--font-body);
  }

  /* LOGO */
  .hdr-logo {
    display: flex;
    align-items: center;
    gap: 10px;
    text-decoration: none;
    flex-shrink: 0;
    padding: 4px 10px 4px 0;
  }

  .hdr-logo-mark {
    width: 32px;
    height: 32px;
    border-radius: 8px;
    background: rgba(200,255,0,0.1);
    border: 1px solid rgba(200,255,0,0.2);
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    overflow: hidden;
  }

  .hdr-logo-img {
    width: 22px;
    height: 22px;
    object-fit: contain;
    display: block;
    filter: drop-shadow(0 0 1px rgba(200,255,0,0.8));
  }

  .hdr-logo-fallback {
    font-family: var(--font-display);
    font-size: 11px;
    font-weight: 800;
    color: var(--accent);
    letter-spacing: 0.06em;
  }

  .hdr-logo-text {
    display: flex;
    flex-direction: column;
    line-height: 1;
    gap: 2px;
  }

  .hdr-logo-name {
    font-family: var(--font-display);
    font-size: 13px;
    font-weight: 800;
    color: #c8ff00;
    letter-spacing: 0.04em;
  }

  .hdr-logo-sub {
    font-size: 9.5px;
    font-weight: 400;
    color: var(--ink2);
    letter-spacing: 0.04em;
  }

  /* DIVIDER */
  .hdr-div {
    width: 1px;
    height: 20px;
    background: var(--border);
    margin: 0 16px;
    flex-shrink: 0;
  }

  /* BREADCRUMB */
  .hdr-nav {
    display: flex;
    align-items: center;
    gap: 6px;
    min-width: 0;
    font-size: 12px;
    color: var(--muted);
    flex-shrink: 0;
  }

  .hdr-crumb-home {
    font-weight: 500;
    color: var(--ink2);
    text-decoration: none;
    flex-shrink: 0;
    transition: color 0.15s;
  }

  .hdr-crumb-home:hover { color: #fff; }

  .hdr-crumb-sep {
    color: var(--muted);
    font-size: 14px;
    flex-shrink: 0;
  }

  .hdr-crumb-module {
    color: var(--ink2);
    flex-shrink: 0;
    font-weight: 400;
  }

  .hdr-crumb-tile {
    font-weight: 600;
    color: var(--accent);
    background: rgba(200,255,0,0.08);
    border: 1px solid rgba(200,255,0,0.15);
    padding: 2px 8px;
    border-radius: 4px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    letter-spacing: 0.01em;
  }

  /* ════════ SEARCH ════════ */
  .hdr-search-wrap {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0 16px;
    min-width: 0;
    position: relative;
  }

  .hdr-search-box {
    position: relative;
    width: 100%;
    max-width: 360px;
  }

  .hdr-search-icon {
    position: absolute;
    left: 10px;
    top: 50%;
    transform: translateY(-50%);
    color: var(--muted);
    pointer-events: none;
    display: flex;
    align-items: center;
  }

  .hdr-search-input {
    width: 100%;
    height: 32px;
    background: rgba(255,255,255,0.05);
    border: 1px solid rgba(255,255,255,0.09);
    border-radius: 8px;
    padding: 0 32px 0 32px;
    font-family: var(--font-body);
    font-size: 12px;
    color: #fff;
    outline: none;
    transition: border-color 0.15s, background 0.15s;
    letter-spacing: 0.01em;
  }

  .hdr-search-input::placeholder { color: var(--muted); }

  .hdr-search-input:focus {
    border-color: rgba(200,255,0,0.35);
    background: rgba(200,255,0,0.04);
  }

  .hdr-search-kbd {
    position: absolute;
    right: 8px;
    top: 50%;
    transform: translateY(-50%);
    font-family: var(--font-display);
    font-size: 8px;
    font-weight: 700;
    color: var(--muted);
    background: rgba(255,255,255,0.05);
    border: 1px solid rgba(255,255,255,0.08);
    border-radius: 3px;
    padding: 1px 4px;
    letter-spacing: 0.04em;
    pointer-events: none;
  }

  /* Search dropdown */
  .hdr-search-drop {
    position: absolute;
    top: calc(100% + 6px);
    left: 50%;
    transform: translateX(-50%);
    width: 100%;
    max-width: 360px;
    background: #13162a;
    border: 1px solid rgba(255,255,255,0.09);
    border-radius: 12px;
    overflow: hidden;
    box-shadow: 0 16px 40px rgba(0,0,0,0.5);
    z-index: 999;
    max-height: 340px;
    overflow-y: auto;
    scrollbar-width: none;
  }

  .hdr-search-drop::-webkit-scrollbar { display: none; }

  .hdr-search-group-label {
    font-family: var(--font-display);
    font-size: 7.5px;
    font-weight: 700;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    color: rgba(255,255,255,0.2);
    padding: 10px 14px 5px;
  }

  .hdr-search-item {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 9px 14px;
    cursor: pointer;
    transition: background 0.12s;
    -webkit-tap-highlight-color: transparent;
  }

  .hdr-search-item:hover,
  .hdr-search-item.focused {
    background: rgba(200,255,0,0.07);
  }

  .hdr-search-item-icon {
    width: 28px;
    height: 28px;
    border-radius: 7px;
    background: rgba(255,255,255,0.05);
    border: 1px solid rgba(255,255,255,0.07);
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    color: rgba(255,255,255,0.35);
  }

  .hdr-search-item-text { flex: 1; min-width: 0; }

  .hdr-search-item-label {
    font-size: 12px;
    font-weight: 500;
    color: rgba(255,255,255,0.85);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .hdr-search-item-label mark {
    background: transparent;
    color: var(--accent);
    font-weight: 700;
  }

  .hdr-search-item-module {
    font-size: 10px;
    color: var(--muted);
    margin-top: 1px;
  }

  .hdr-search-arrow {
    color: var(--muted);
    flex-shrink: 0;
  }

  .hdr-search-empty {
    padding: 24px 14px;
    text-align: center;
    font-size: 12px;
    color: var(--muted);
  }

  /* COMPANY BLOCK */
  .hdr-company {
    display: none;
    flex-direction: column;
    align-items: flex-end;
    gap: 2px;
    flex-shrink: 0;
  }

  @media (min-width: 1024px) { .hdr-company { display: flex; } }

  .hdr-company-row1 {
    display: flex;
    align-items: center;
    gap: 7px;
  }

  .hdr-badge {
    font-family: var(--font-display);
    font-size: 9px;
    font-weight: 800;
    letter-spacing: 0.1em;
    padding: 2px 6px;
    border-radius: 4px;
    background: var(--accent);
    color: #09100a;
  }

  .hdr-company-name {
    font-size: 11.5px;
    font-weight: 500;
    color: var(--ink2);
    max-width: 200px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .hdr-company-row2 {
    display: flex;
    align-items: center;
    gap: 5px;
    font-size: 10px;
    color: var(--muted);
  }

  .hdr-loc {
    display: flex;
    align-items: center;
    gap: 3px;
  }

  /* ACTIONS */
  .hdr-actions {
    display: flex;
    align-items: center;
    gap: 4px;
    margin-left: 8px;
    flex-shrink: 0;
  }

  .hdr-icon-btn {
    position: relative;
    width: 34px;
    height: 34px;
    border-radius: 8px;
    border: 1px solid rgba(255,255,255,0.08);
    background: transparent;
    color: var(--muted);
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: background 0.15s, color 0.15s, border-color 0.15s;
  }

  .hdr-icon-btn:hover {
    background: rgba(255,255,255,0.06);
    color: #fff;
    border-color: rgba(255,255,255,0.15);
  }

  .hdr-notif-dot {
    position: absolute;
    top: 7px;
    right: 7px;
    width: 5px;
    height: 5px;
    border-radius: 50%;
    background: #ef4444;
    border: 1.5px solid var(--bg);
  }

  .hdr-avatar {
    width: 34px;
    height: 34px;
    border-radius: 8px;
    background: rgba(200,255,0,0.12);
    border: 1px solid rgba(200,255,0,0.22);
    color: var(--accent);
    font-family: var(--font-display);
    font-size: 10px;
    font-weight: 800;
    letter-spacing: 0.06em;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: background 0.15s;
  }

  .hdr-avatar:hover { background: rgba(200,255,0,0.2); }

  @media (max-width: 768px) {
    .hdr-root { padding: 0 14px 0 56px; }
    .hdr-div { margin: 0 10px; }
    .hdr-logo-text { display: none; }
    .hdr-nav { display: none; }
    .hdr-search-wrap { padding: 0 8px 0 0; }
  }

  @media (max-width: 480px) {
    .hdr-search-kbd { display: none; }
  }
`

// Build flat searchable list from all modules + tiles
function buildSearchIndex() {
  const items = []
  for (const mod of NAV_MODULES) {
    for (const tile of (mod.tiles || [])) {
      items.push({ moduleId: mod.id, moduleLabel: mod.label, tile })
    }
  }
  return items
}

function highlight(text, query) {
  if (!query) return text
  const idx = text.toLowerCase().indexOf(query.toLowerCase())
  if (idx === -1) return text
  return (
    <>
      {text.slice(0, idx)}
      <mark>{text.slice(idx, idx + query.length)}</mark>
      {text.slice(idx + query.length)}
    </>
  )
}

const TileIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="18" height="18" rx="3"/><path d="M9 9h6M9 12h6M9 15h4"/>
  </svg>
)

export default function Header() {
  const { pathname } = useLocation()
  const navigate = useNavigate()
  const match = findModuleByTilePath(pathname)

  const [query, setQuery] = useState('')
  const [open, setOpen] = useState(false)
  const [focusedIdx, setFocusedIdx] = useState(0)
  const inputRef = useRef(null)
  const wrapRef = useRef(null)

  const allItems = buildSearchIndex()

  const results = query.trim().length > 0
    ? allItems.filter(({ moduleLabel, tile }) =>
        tile.label.toLowerCase().includes(query.toLowerCase()) ||
        moduleLabel.toLowerCase().includes(query.toLowerCase())
      ).slice(0, 12)
    : []

  // Group results by module
  const grouped = results.reduce((acc, item) => {
    const key = item.moduleLabel
    if (!acc[key]) acc[key] = []
    acc[key].push(item)
    return acc
  }, {})

  // Keyboard shortcut: / or Ctrl+K
  useEffect(() => {
    const onKey = (e) => {
      if ((e.key === '/' || (e.ctrlKey && e.key === 'k')) && document.activeElement !== inputRef.current) {
        e.preventDefault()
        inputRef.current?.focus()
      }
      if (e.key === 'Escape') {
        setOpen(false)
        inputRef.current?.blur()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  // Click outside to close
  useEffect(() => {
    const onClickOutside = (e) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', onClickOutside)
    return () => document.removeEventListener('mousedown', onClickOutside)
  }, [])

  const handleKeyDown = (e) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setFocusedIdx(i => Math.min(i + 1, results.length - 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setFocusedIdx(i => Math.max(i - 1, 0))
    } else if (e.key === 'Enter' && results[focusedIdx]) {
      const item = results[focusedIdx]
      if (item.tile.path) {
        navigate(item.tile.path)
        setOpen(false)
        setQuery('')
      }
    }
  }

  const handleSelect = (item) => {
    if (item.tile.path) {
      navigate(item.tile.path)
    }
    setOpen(false)
    setQuery('')
  }

  let flatIdx = 0

  return (
    <>
      <style>{CSS}</style>
      <header className="hdr-root">

        {/* Logo */}
        <Link to="/" className="hdr-logo">
          <div className="hdr-logo-mark">
            <img
              src="/daikin.png"
              alt="Logo"
              className="hdr-logo-img"
              onError={(e) => {
                e.target.style.display = 'none'
                e.target.parentNode.innerHTML = '<span class="hdr-logo-fallback">DAI</span>'
              }}
            />
          </div>
          <div className="hdr-logo-text">
            <span className="hdr-logo-name">DAIKIN</span>
            <span className="hdr-logo-sub">SAP Portal</span>
          </div>
        </Link>

        <div className="hdr-div" />

        {/* Breadcrumb */}
        <nav className="hdr-nav">
          <Link to="/" className="hdr-crumb-home">Home</Link>
          {match && (
            <>
              <span className="hdr-crumb-sep">/</span>
              <span className="hdr-crumb-module">{match.module.label}</span>
              <span className="hdr-crumb-sep">/</span>
              <span className="hdr-crumb-tile">{match.tile.label}</span>
            </>
          )}
        </nav>

        {/* Search */}
        <div className="hdr-search-wrap" ref={wrapRef}>
          <div className="hdr-search-box">
            <span className="hdr-search-icon">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/>
              </svg>
            </span>
            <input
              ref={inputRef}
              className="hdr-search-input"
              type="text"
              placeholder="Search modules & items…"
              value={query}
              onChange={(e) => { setQuery(e.target.value); setOpen(true); setFocusedIdx(0) }}
              onFocus={() => setOpen(true)}
              onKeyDown={handleKeyDown}
              autoComplete="off"
              spellCheck={false}
            />
            <span className="hdr-search-kbd">/</span>

            {/* Dropdown */}
            {open && query.trim().length > 0 && (
              <div className="hdr-search-drop">
                {results.length === 0 ? (
                  <div className="hdr-search-empty">No results for "{query}"</div>
                ) : (
                  Object.entries(grouped).map(([modLabel, items]) => (
                    <div key={modLabel}>
                      <div className="hdr-search-group-label">{modLabel}</div>
                      {items.map((item) => {
                        const idx = flatIdx++
                        return (
                          <div
                            key={item.tile.label + idx}
                            className={`hdr-search-item${focusedIdx === idx ? ' focused' : ''}`}
                            onMouseEnter={() => setFocusedIdx(idx)}
                            onClick={() => handleSelect(item)}
                          >
                            <div className="hdr-search-item-icon"><TileIcon /></div>
                            <div className="hdr-search-item-text">
                              <div className="hdr-search-item-label">
                                {highlight(item.tile.label, query)}
                              </div>
                              <div className="hdr-search-item-module">{item.moduleLabel}</div>
                            </div>
                            <span className="hdr-search-arrow">
                              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M9 18l6-6-6-6"/>
                              </svg>
                            </span>
                          </div>
                        )
                      })}
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        </div>

        {/* Company info */}
        <div className="hdr-company">
          <div className="hdr-company-row1">
            <span className="hdr-badge">{COMPANY}</span>
            <span className="hdr-company-name">{COMPANY_FULL}</span>
          </div>
          <div className="hdr-company-row2">
            <span>{SUPPLIER}</span>
            <span>·</span>
            <span className="hdr-loc">
              <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/>
                <circle cx="12" cy="9" r="2.5"/>
              </svg>
              {LOCATION}
            </span>
          </div>
        </div>

        {/* Actions */}
        <div className="hdr-actions">
          <div className="hdr-div" style={{ margin: '0 4px' }} />
          <button className="hdr-icon-btn" aria-label="Notifications">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
              <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
            </svg>
            <span className="hdr-notif-dot" />
          </button>
          <button className="hdr-avatar" aria-label="Profile">AW</button>
        </div>

      </header>
    </>
  )
}