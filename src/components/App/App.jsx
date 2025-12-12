import { useState } from "react";
import Header from "../header/header.jsx";
import Profile from "../profile/profile.jsx";
import Footer from "../footer/footer.jsx";
import MoodForm from "../MoodLogger/MoodModal.jsx";
import MoodDashboard from "../Dashboard/MoodDashboard.jsx";
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
    
      <Header />

      <main className="app-main">

        <Profile
          onAvatarClick={() => setIsModalOpen(true)}
          onLogMoodClick={() => setIsModalOpen(true)}
          onStatsClick={() => setIsModalOpen(true)}
        />

        <MoodDashboard entries={[]} stats={null} />
      </main>

      <Footer />

      {isModalOpen && (
        <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button
              className="modal-close"
              onClick={() => setIsModalOpen(false)}
            >
              ×
            </button>
            <MoodForm onSubmit={handleMoodSubmit} />
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
