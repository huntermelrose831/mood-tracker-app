import { useState } from "react";
import MoodForm from "./components/MoodLogger/MoodForm";
import MoodDashboard from "./components/Dashboard/MoodDashboard";
import "./App.css";

function App() {
  const [view, setView] = useState("form"); // 'form' or 'dashboard'

  // TODO: Implement data loading and state management
  // - Load entries from localStorage
  // - Load sample data on first run
  // - Calculate statistics

  const handleMoodSubmit = (formData) => {
    // TODO: Save mood entry to localStorage
    console.log("Mood submitted:", formData);
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1>🌈 Holiday Mood Tracker</h1>
        <nav>
          <button
            className={view === "form" ? "active" : ""}
            onClick={() => setView("form")}
          >
            Log Mood
          </button>
          <button
            className={view === "dashboard" ? "active" : ""}
            onClick={() => setView("dashboard")}
          >
            Dashboard
          </button>
        </nav>
      </header>

      <main className="app-main">
        {view === "form" ? (
          <MoodForm onSubmit={handleMoodSubmit} />
        ) : (
          <MoodDashboard entries={[]} stats={null} />
        )}
      </main>
    </div>
  );
}

export default App;
