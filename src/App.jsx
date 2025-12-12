import { useState } from "react";
<<<<<<< HEAD
import MoodForm from "./components/MoodLogger/MoodForm";
import "./components/App/App.css";
import EditProfileModal from "./components/editProfile/editProfileModal";
=======
import MoodForm from "./components/MoodLogger/MoodModal";
import "./App.css";
>>>>>>> 849a5dabf9136bb04cc9354b97ea85a2fe92dbc9

function App() {
  const [activeModal, setActiveModal] = useState("");

  // TODO: Implement data loading and state management
  // - Load entries from localStorage
  // - Load sample data on first run
  // - Calculate statistics

  const handleMoodSubmit = (formData) => {
    // TODO: Save mood entry to localStorage
    console.log("Mood submitted:", formData);
    setActiveModal("");
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1>🎄Holiday Mood Tracker</h1>
        <button className="log-mood-btn" onClick={() => setActiveModal("mood")}>
          + Log Mood
        </button>
        <button className="log-mood-btn" onClick={() => setActiveModal("edit")}>
          Edit Profile
        </button>
      </header>

      <main className="app-main">
        {/* TODO: Dashboard content will go here */}
        <div className="dashboard">
          <h2>Your Mood Dashboard</h2>
          <p>Dashboard content coming soon...</p>
        </div>
      </main>

      {activeModal === "mood" && (
        <MoodForm
          onSubmit={handleMoodSubmit}
          onClose={() => setActiveModal("")}
          isOpen={activeModal === "mood"}
        />
      )}
      {activeModal === "edit" && (
        <EditProfileModal
          onClose={() => setActiveModal("")}
          isOpen={activeModal === "edit"}
        />
      )}
    </div>
  );
}

export default App;
