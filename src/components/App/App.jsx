import { useState } from "react";
import MoodModal from "../MoodLogger/MoodModal.jsx";
import MoodDashboard from "../Dashboard/MoodDashboard";
import Header from "../header/header.jsx";
import Footer from "../footer/footer.jsx";
import "./App.css";
import ModalForm from "../../ModalForm/ModalForm.jsx";
import ModalContent from "../../ModalForm/ModalContent.jsx";

function App() {
  const [isOpen, setIsOpen] = useState(false);
  const [view, setView] = useState("dashboard");
  const [modal, setModal] = useState(""); // 'dashboard' or 'stats'

  // TODO: Implement data loading and state management
  // - Load entries from localStorage
  // - Load sample data on first run
  // - Calculate statistics



  const handleMoodSubmit = (formData) => {
    // TODO: Save mood entry to localStorage
    console.log("Mood submitted:", formData);
    setIsOpen(false);
  };

  return (
    <div className="app">
      <Header
        onLogMoodClick={() => setIsOpen(true)}
        onStatsClick={() => setView(view === "stats" ? "dashboard" : "stats")}
        currentView={view}
      />

      <main className="app-main">
        {view === "dashboard" ? (
          <div className="dashboard">
            <h2>Your Mood Dashboard</h2>
            <p>Dashboard content coming soon...</p>
          </div>
        ) : (
          <MoodDashboard entries={[]} stats={null} />
        )}
      </main>

      <Footer />

      <ModalForm isOpen={isOpen} onClose={() => setIsOpen(false)}>
        <ModalContent modal={modal}/>
      </ModalForm>

      {isOpen && (
        <MoodModal
          onSubmit={handleMoodSubmit}
          onClose={() => setIsOpen(false)}
        />
      )}
    </div>
  );
}

export default App;
