import { useNavigate } from 'react-router-dom'
import { ICONS } from './icons.jsx'

const NEONS = ['#c8ff00', '#ff6b35', '#00f5ff']
const NEON_TEXT = ['#0b0e17', '#ffffff', '#0b0e17']

const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@300;400;500&display=swap');

  .tg-wrap {
    --neon0: #c8ff00;
    --neon1: #ff6b35;
    --neon2: #00f5ff;
    --ink: #0b0e17;
    --paper: #f5f3ee;
    --muted: #9096a8;
    --border: rgba(0,0,0,0.09);
    --card-bg: #ffffff;
    --font-d: 'Syne', sans-serif;
    --font-b: 'DM Sans', sans-serif;
  }

  @media (prefers-color-scheme: dark) {
    .tg-wrap {
      --ink: #edeae3;
      --paper: #0e1017;
      --card-bg: #111520;
      --muted: #4a5060;
      --border: rgba(255,255,255,0.06);
    }
  }

  .tg-wrap { font-family: var(--font-b); }

  .tg-empty {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 10px;
    padding: 80px 24px;
    border: 1px dashed var(--border);
    border-radius: 14px;
    color: var(--muted);
    font-size: 13px;
    letter-spacing: 0.02em;
  }

  .tg-empty-icon { font-size: 40px; opacity: 0.5; margin-bottom: 4px; }

  .tg-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: 14px;
  }

  /* ── CARD BASE ── */
  .tg-card {
    position: relative;
    background: var(--card-bg);
    border: 1px solid var(--border);
    border-radius: 14px;
    padding: 20px 18px 16px;
    cursor: pointer;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    min-height: 160px;
    overflow: hidden;
    transition: transform 0.22s cubic-bezier(0.34,1.56,0.64,1),
                border-color 0.2s, box-shadow 0.2s;
    animation: tg-in 0.5s cubic-bezier(0.16,1,0.3,1) both;
    -webkit-tap-highlight-color: transparent;
  }

  @keyframes tg-in {
    from { opacity: 0; transform: translateY(16px) scale(0.96); }
    to   { opacity: 1; transform: translateY(0) scale(1); }
  }

  /* radial glow overlay */
  .tg-card::before {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: 14px;
    opacity: 0;
    transition: opacity 0.3s;
    pointer-events: none;
  }

  /* scan line */
  .tg-scan {
    position: absolute;
    top: -100%;
    left: 0;
    width: 100%;
    height: 40%;
    pointer-events: none;
  }

  /* ── PER-COLOR (0/1/2 pattern) ── */
  .tg-c0::before { background: radial-gradient(circle at 80% 20%, rgba(200,255,0,0.12) 0%, transparent 60%); }
  .tg-c1::before { background: radial-gradient(circle at 80% 20%, rgba(255,107,53,0.12) 0%, transparent 60%); }
  .tg-c2::before { background: radial-gradient(circle at 80% 20%, rgba(0,245,255,0.12) 0%, transparent 60%); }

  .tg-c0 .tg-scan { background: linear-gradient(to bottom, transparent, rgba(200,255,0,0.07), transparent); }
  .tg-c1 .tg-scan { background: linear-gradient(to bottom, transparent, rgba(255,107,53,0.07), transparent); }
  .tg-c2 .tg-scan { background: linear-gradient(to bottom, transparent, rgba(0,245,255,0.07), transparent); }

  .tg-card:hover::before { opacity: 1; }

  .tg-c0:hover { border-color: rgba(200,255,0,0.6); box-shadow: 0 0 0 1px rgba(200,255,0,0.25), 0 16px 48px -8px rgba(200,255,0,0.15); }
  .tg-c1:hover { border-color: rgba(255,107,53,0.6); box-shadow: 0 0 0 1px rgba(255,107,53,0.25), 0 16px 48px -8px rgba(255,107,53,0.15); }
  .tg-c2:hover { border-color: rgba(0,245,255,0.6);  box-shadow: 0 0 0 1px rgba(0,245,255,0.25),  0 16px 48px -8px rgba(0,245,255,0.15); }

  .tg-card:hover { transform: translateY(-4px) scale(1.02); }

  .tg-card:hover .tg-scan { animation: tg-scanline 1.2s linear infinite; }
  @keyframes tg-scanline {
    from { top: -40%; }
    to   { top: 110%; }
  }

  /* ── NUM ── */
  .tg-num {
    position: absolute;
    top: 12px;
    right: 14px;
    font-family: var(--font-d);
    font-size: 10px;
    font-weight: 800;
    letter-spacing: 0.1em;
    color: var(--muted);
    opacity: 0.5;
  }

  /* ── TOP ROW ── */
  .tg-top {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
  }

  .tg-icon-box {
    width: 44px;
    height: 44px;
    border-radius: 10px;
    background: var(--border);
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--ink);
    flex-shrink: 0;
    transition: background 0.2s, color 0.2s,
                transform 0.3s cubic-bezier(0.34,1.56,0.64,1);
  }

  .tg-c0:hover .tg-icon-box { background: #c8ff00; color: #0b0e17; transform: rotate(-8deg) scale(1.15); }
  .tg-c1:hover .tg-icon-box { background: #ff6b35; color: #ffffff; transform: rotate(-8deg) scale(1.15); }
  .tg-c2:hover .tg-icon-box { background: #00f5ff; color: #0b0e17; transform: rotate(-8deg) scale(1.15); }

  /* ── PULSE ── */
  .tg-pulse {
    width: 10px;
    height: 10px;
    border-radius: 50%;
    position: relative;
    flex-shrink: 0;
  }

  .tg-c0 .tg-pulse { background: #c8ff00; }
  .tg-c1 .tg-pulse { background: #ff6b35; }
  .tg-c2 .tg-pulse { background: #00f5ff; }

  .tg-pulse::after {
    content: '';
    position: absolute;
    inset: -4px;
    border-radius: 50%;
    opacity: 0;
    animation: tg-pulse 2s ease-out infinite;
  }

  .tg-c0 .tg-pulse::after { border: 1.5px solid #c8ff00; }
  .tg-c1 .tg-pulse::after { border: 1.5px solid #ff6b35; }
  .tg-c2 .tg-pulse::after { border: 1.5px solid #00f5ff; }

  @keyframes tg-pulse {
    0%   { transform: scale(0.6); opacity: 0.8; }
    100% { transform: scale(2.2); opacity: 0; }
  }

  /* ── FOOT ── */
  .tg-label {
    font-family: var(--font-d);
    font-size: 14px;
    font-weight: 800;
    color: var(--ink);
    letter-spacing: -0.02em;
    line-height: 1.25;
    margin-bottom: 4px;
  }

  .tg-sub {
    font-size: 11.5px;
    color: var(--muted);
    line-height: 1.5;
  }

  /* ── BOTTOM BAR ── */
  .tg-bar {
    position: absolute;
    bottom: 0;
    left: 0;
    height: 2px;
    width: 0;
    border-radius: 0 2px 0 0;
    transition: width 0.35s cubic-bezier(0.34,1.56,0.64,1);
  }

  .tg-c0 .tg-bar { background: #c8ff00; }
  .tg-c1 .tg-bar { background: #ff6b35; }
  .tg-c2 .tg-bar { background: #00f5ff; }

  .tg-card:hover .tg-bar { width: 45%; }

  @media (max-width: 600px) {
    .tg-grid { grid-template-columns: repeat(2, 1fr); gap: 10px; }
    .tg-card { min-height: 140px; padding: 14px 12px 12px; }
    .tg-label { font-size: 13px; }
    .tg-icon-box { width: 38px; height: 38px; }
  }

  @media (max-width: 380px) {
    .tg-grid { grid-template-columns: 1fr; }
  }
`

export default function TileGrid({ tiles }) {
  const navigate = useNavigate()

  if (!tiles || tiles.length === 0) {
    return (
      <>
        <style>{CSS}</style>
        <div className="tg-wrap">
          <div className="tg-empty">
            <span className="tg-empty-icon">◻</span>
            No tiles configured yet
          </div>
        </div>
      </>
    )
  }

  return (
    <>
      <style>{CSS}</style>
      <div className="tg-wrap">
        <div className="tg-grid">
          {tiles.map((tile, i) => {
            const Icon = ICONS[tile.icon] || ICONS.default
            const c = i % 3
            return (
              <div
                key={tile.id}
                onClick={() => navigate(tile.path)}
                className={`tg-card tg-c${c}`}
                style={{ animationDelay: `${i * 0.07}s` }}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => e.key === 'Enter' && navigate(tile.path)}
              >
               

                <div className="tg-top">
                  <div className="tg-icon-box">
                    <Icon size={20} />
                  </div>
                  <div className="tg-pulse" />
                </div>

                <div>
                  <div className="tg-label">{tile.label}</div>
                  {tile.sub && <div className="tg-sub">{tile.sub}</div>}
                </div>

                <div className="tg-bar" />
              </div>
            )
          })}
        </div>
      </div>
    </>
  )
}