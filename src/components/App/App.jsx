import { useState } from "react";
import Header from "../header/header.jsx";
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
      <Header onLogMoodClick={() => setIsModalOpen(true)} />

      <main className="app__main">
        <MoodDashboard entries={[]} stats={null} />
      </main>

      <Footer />

      {isModalOpen && (
        <div className="modal" onClick={() => setIsModalOpen(false)}>
          <div className="modal__overlay" onClick={(e) => e.stopPropagation()}>
            <button
              className="modal__close-button"
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
