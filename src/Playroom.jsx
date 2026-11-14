import { ToyArt } from './ToyArt'

const toys = [
  ['royal-poop', 'Royal Poop Battle', '💩', '#f4e5fc', '#e6cef3'],
  ['shapes', 'Shapes', '🔷', '#e1f3f0', '#c9e8e1'],
  ['patterns', 'Patterns', '🌟', '#fff0d8', '#f6e0b9'],
  ['letters', 'Letters', '🔤', '#eee5fb', '#e0cff6'],
  ['counting', 'Counting', '🌻', '#fbe8ed', '#f2d3df'],
  ['story', 'Stories', '📖', '#eee8fd', '#ded3f5'],
  ['colors', 'Colors', '🎨', '#fce8db', '#f0d7c7'],
  ['combine', 'Mix & Match', '🧩', '#e7effd', '#d2e2f8'],
  ['time', 'Time', '🕐', '#f2e7fd', '#e4d1f7'],
  ['dinos', 'Dinos', '🦕', '#e6f1dd', '#d4e6c8'],
  ['cashier', 'Little Shop', '🛒', '#ffeddf', '#f2dccb'],
]

export default function Playroom({ onOpen, installPrompt, isInstalled, showInstallTip, onInstall, onToggleTip }) {
  return <main className="world-home">
    <div className="world-shell">
      <header className="world-top">
        <span className="world-logo">BRIE</span>
        {isInstalled ? <span>Installed</span> : <button type="button" className="world-install"
          aria-expanded={installPrompt ? undefined : showInstallTip} onClick={installPrompt ? onInstall : onToggleTip}>
          Add to Home Screen
        </button>}
        {showInstallTip && !installPrompt && !isInstalled &&
          <div className="world-tip">Open your browser’s Share or Menu button and choose “Add to Home Screen.”</div>}
      </header>
      <section className="world-hero">
        <div className="world-copy"><h1>Brie’s Playroom</h1><p>Play, explore &amp; discover.</p></div>
        <ToyArt kind="home" fallback="🏰" className="world-island" />
      </section>
      <section aria-labelledby="playroom-games">
        <div className="world-section"><h2 id="playroom-games">Pick a game</h2></div>
        <div className="world-grid">
          {toys.map(([id, label, fallback, tile, base]) => <button type="button" key={id}
            className="world-tile" style={{ '--tile': tile, '--base': base }} onClick={() => onOpen(id)}>
            <ToyArt kind={id} fallback={fallback} size={78} />
            <span>{label}</span>
          </button>)}
        </div>
      </section>
      <footer className="world-footer">No ads. No data collected.</footer>
    </div>
  </main>
}
