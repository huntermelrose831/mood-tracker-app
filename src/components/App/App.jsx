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
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isStatsOpen, setIsStatsOpen] = useState(false);
  const [entries, setEntries] = useState([]);
  const [stats, setStats] = useState(null);

  // Load entries on mount
  useEffect(() => {
    const loadData = async () => {
      // Force reload from user.json by clearing cache if needed
      await dataService.loadSampleData();

      // Get fresh entries from localStorage
      const loadedEntries = dataService.getEntries();
      console.log("Loaded entries:", loadedEntries);

      const statistics = dataService.getStatistics(loadedEntries);

      setEntries(loadedEntries);
      setStats(statistics);
    };

    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleMoodSubmit = async (formData) => {
    // Save mood entry to localStorage
    const newEntry = dataService.saveEntry(formData);
    console.log("Mood submitted:", newEntry);

    // Refresh the data to show new entry
    await dataService.loadSampleData();
    const loadedEntries = dataService.getEntries();
    const statistics = dataService.getStatistics(loadedEntries);
    setEntries(loadedEntries);
    setStats(statistics);

    // Close the modal
    setIsModalOpen(false);
  };

  const handleStatsClick = () => {
    setIsStatsOpen(true);
  };

  return (
    <div className="app">
      <Header />
      <Profile
        onLogMoodClick={() => setIsModalOpen(true)}
        onStatsClick={handleStatsClick}
      />

      <main className="app__main">
        <MoodDashboard entries={entries} stats={stats} />
      </main>

      <Footer />

      {isModalOpen && (
        <MoodModal
          onSubmit={handleMoodSubmit}
          onClose={() => setIsModalOpen(false)}
        />
      )}

      {isStatsOpen && (
        <Stats entries={entries} onClose={() => setIsStatsOpen(false)} />
      )}
    </div>
  );
}

export default App;
