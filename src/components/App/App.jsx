import { useState } from "react";
import Header from "../header/header.jsx";
import Footer from "../footer/footer.jsx";
import MoodModal from "../MoodLogger/MoodModal.jsx";
import MoodDashboard from "../Dashboard/MoodDashboard.jsx";
import "./App.css";

function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);

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
        <MoodModal
          onSubmit={handleMoodSubmit}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </div>
  );
}

export default App;
