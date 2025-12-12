import "./header.css";

export default function Header({ onLogMoodClick, onStatsClick, currentView }) {
  return (
    <header className="header">
      <h1 className="header__title">🎄Holiday Mood Tracker</h1>
      <nav className="header__nav">
        <button
          className="header__button header__button--primary"
          onClick={onLogMoodClick}
        >
          + Log Mood
        </button>
        <button className="header__button" onClick={onStatsClick}>
          Stats
        </button>
      </nav>
    </header>
  );
}
