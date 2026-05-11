import { NAV_MODULES } from '../router/index.jsx'
import { useRef, useEffect, useState } from 'react'

const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500&display=swap');

  .nb-wrap {
    --ink: #0b0e17;
    --ink2: #3d4254;
    --muted: #9096a8;
    --accent: #c8ff00;
    --border: rgba(0,0,0,0.08);
    --bg: #f5f3ee;
    --surface: #ffffff;
    --font-display: 'Syne', sans-serif;
    --font-body: 'DM Sans', sans-serif;

    display: flex;
    align-items: center;
    background: var(--surface);
    border-bottom: 1px solid var(--border);
    padding: 0 8px;
    height: 48px;
    position: sticky;
    top: 56px;
    z-index: 190;
  }

  @media (prefers-color-scheme: dark) {
    .nb-wrap {
      --ink: #edeae3;
      --ink2: #9096a8;
      --muted: #4a5060;
      --border: rgba(255,255,255,0.07);
      --bg: #0e1017;
      --surface: #161a26;
    }
  }

  /* SCROLL TRACK */
  .nb-track {
    flex: 1;
    display: flex;
    align-items: center;
    overflow-x: auto;
    scrollbar-width: none;
    scroll-behavior: smooth;
    position: relative;
    gap: 2px;
    padding: 0 4px;
  }

  .nb-track::-webkit-scrollbar { display: none; }

  /* BUTTON */
  .nb-btn {
    position: relative;
    display: flex;
    align-items: center;
    gap: 7px;
    flex-shrink: 0;
    height: 34px;
    padding: 0 14px;
    border: none;
    background: transparent;
    cursor: pointer;
    border-radius: 7px;
    font-family: var(--font-body);
    font-size: 12.5px;
    font-weight: 400;
    color: var(--muted);
    white-space: nowrap;
    transition: color 0.15s, background 0.15s;
    -webkit-tap-highlight-color: transparent;
  }

  .nb-btn:hover {
    color: var(--ink);
    background: var(--border);
  }

  .nb-btn.active {
    color: var(--ink);
    font-weight: 600;
    font-family: var(--font-display);
    background: var(--border);
  }

  /* ACTIVE BOTTOM LINE */
  .nb-btn.active::after {
    content: '';
    position: absolute;
    bottom: -7px;
    left: 14px;
    right: 14px;
    height: 2px;
    background: var(--accent);
    border-radius: 2px 2px 0 0;
  }

  /* DOT */
  .nb-dot {
    width: 5px;
    height: 5px;
    border-radius: 50%;
    background: var(--border);
    flex-shrink: 0;
    transition: background 0.15s, transform 0.2s;
  }

  .nb-btn.active .nb-dot {
    background: var(--accent);
    transform: scale(1.2);
  }

  .nb-btn:hover .nb-dot { background: var(--muted); }

  /* COUNT BADGE */
  .nb-count {
    font-size: 9.5px;
    font-weight: 500;
    color: var(--muted);
    background: var(--border);
    padding: 1px 5px;
    border-radius: 10px;
    font-family: var(--font-body);
    font-variant-numeric: tabular-nums;
    letter-spacing: 0.02em;
  }

  .nb-btn.active .nb-count {
    background: rgba(200,255,0,0.18);
    color: #3d4800;
  }

  @media (prefers-color-scheme: dark) {
    .nb-btn.active .nb-count { color: #b8e000; }
  }

  /* SCROLL ARROWS */
  .nb-arrow {
    width: 30px;
    height: 30px;
    border: 1px solid var(--border);
    background: transparent;
    color: var(--muted);
    cursor: pointer;
    border-radius: 7px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    transition: background 0.15s, color 0.15s;
    margin: 0 2px;
  }

  .nb-arrow:hover {
    background: var(--border);
    color: var(--ink);
  }

  .nb-arrow svg { display: block; }

  @media (max-width: 768px) {
    .nb-wrap { display: none; }
  }
`

export default function NavBar({ activeModule, onSelect }) {
  const trackRef = useRef(null)
  const buttonRefs = useRef({})

  useEffect(() => {
    const btn = buttonRefs.current[activeModule]
    if (!btn) return
    btn.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' })
  }, [activeModule])

  const scroll = (dir) => {
    trackRef.current?.scrollBy({ left: dir * 220, behavior: 'smooth' })
  }

  return (
    <>
      <style>{CSS}</style>
      <div className="nb-wrap">
        <button className="nb-arrow" onClick={() => scroll(-1)} aria-label="Scroll left">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </button>

        <div className="nb-track" ref={trackRef}>
          {NAV_MODULES.map((mod) => {
            const isActive = activeModule === mod.id
            return (
              <button
                key={mod.id}
                ref={(el) => (buttonRefs.current[mod.id] = el)}
                onClick={() => onSelect(mod.id)}
                className={`nb-btn${isActive ? ' active' : ''}`}
              >
                <span className="nb-dot" />
                {mod.label}
                {mod.tiles?.length > 0 && (
                  <span className="nb-count">{mod.tiles.length}</span>
                )}
              </button>
            )
          })}
        </div>

        <button className="nb-arrow" onClick={() => scroll(1)} aria-label="Scroll right">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 18l6-6-6-6" />
          </svg>
        </button>
      </div>
    </>
  )
}