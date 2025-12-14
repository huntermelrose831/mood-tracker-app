import { useState, useEffect } from "react";
import Header from "../header/header.jsx";
import Profile from "../profile/profile.jsx";
import Footer from "../footer/footer.jsx";
import MoodModal from "../MoodLogger/MoodModal.jsx";
import MoodDashboard from "../Dashboard/MoodDashboard.jsx";
import Stats from "../Stats/Stats.jsx";
import { dataService } from "../../services/dataService.js";
import "./App.css";

function App() {
  // State management - keeping track of UI states and data
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isStatsOpen, setIsStatsOpen] = useState(false);
  const [entries, setEntries] = useState([]);
  const [stats, setStats] = useState(null);

  // Load initial data when component mounts
  // TODO: maybe add error handling here later
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        await dataService.loadSampleData();
        const allEntries = dataService.getEntries();
        const currentStats = dataService.getStatistics(allEntries);

        setEntries(allEntries);
        setStats(currentStats);
      } catch (error) {
        console.error("Failed to load data:", error);
        // For now just log it, could show user notification later
      }
    };

    loadInitialData();
  }, []);

  // Handle new mood entry submission
  const handleMoodSubmit = async (formData) => {
    try {
      dataService.saveEntry(formData);

      // Reload data to get updated stats - not the most efficient but works
      await dataService.loadSampleData();
      const updatedEntries = dataService.getEntries();
      const updatedStats = dataService.getStatistics(updatedEntries);

      setEntries(updatedEntries);
      setStats(updatedStats);
      setIsModalOpen(false); // Close the modal
    } catch (error) {
      console.error("Error saving mood entry:", error);
    }
  };

  const openStatsModal = () => {
    setIsStatsOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const closeStatsModal = () => {
    setIsStatsOpen(false);
  };

  return (
    <div className="app">
      <Header />

      <Profile
        onLogMoodClick={() => setIsModalOpen(true)}
        onStatsClick={openStatsModal}
      />

      <main className="app__main">
        <MoodDashboard entries={entries} stats={stats} />
      </main>

      <Footer />

      {/* Conditionally render modals */}
      {isModalOpen && (
        <MoodModal onSubmit={handleMoodSubmit} onClose={closeModal} />
      )}

      {isStatsOpen && <Stats entries={entries} onClose={closeStatsModal} />}
    </div>
  );
}

export default App;
