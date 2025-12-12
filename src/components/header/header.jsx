import "./header.css";

export default function Header({ onLogMoodClick, onStatsClick, currentView }) {
  return (
    <header className="app-header">
      <h1>🎄Holiday Mood Tracker</h1>
      <nav>
        <button className="log-mood-btn" onClick={onLogMoodClick}>
          + Log Mood
        </button>
        <button className="log-mood-btn" onClick={onStatsClick}>
          Stats
        </button>
      </nav>
    </header>
  );
}
