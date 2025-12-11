import { useState } from "react";
import MoodForm from "./components/MoodLogger/MoodForm";
import "./App.css";

function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  // TODO: Implement data loading and state management
  // - Load entries from localStorage
  // - Load sample data on first run
  // - Calculate statistics

  const handleMoodSubmit = (formData) => {
    // TODO: Save mood entry to localStorage
    console.log("Mood submitted:", formData);
    setIsModalOpen(false);
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1>🎄Holiday Mood Tracker</h1>
        <button className="log-mood-btn" onClick={() => setIsModalOpen(true)}>
          + Log Mood
        </button>
      </header>

      <main className="app-main">
        {/* TODO: Dashboard content will go here */}
        <div className="dashboard">
          <h2>Your Mood Dashboard</h2>
          <p>Dashboard content coming soon...</p>
        </div>
      </main>

      {isModalOpen && (
        <MoodForm
          onSubmit={handleMoodSubmit}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </div>
  );
}

export default App;
