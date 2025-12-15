import { useState, useEffect } from "react";
import Header from "../header/header.jsx";
import Profile from "../profile/profile.jsx";
import Footer from "../footer/footer.jsx";
import MoodModal from "../MoodModal/MoodModal.jsx";
import MoodDashboard from "../Dashboard/MoodDashboard.jsx";
import Stats from "../Stats/Stats.jsx";
import EditProfileModal from "../editProfile/editProfileModal.jsx";
import { dataService } from "../../services/dataService.js";
import "./App.css";

function App() {
  const [activeModal, setActiveModal] = useState(null);
  const [entries, setEntries] = useState([]);
  const [stats, setStats] = useState(null);
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

  const handleMoodSubmit = async (formData) => {
    try {
      dataService.saveEntry(formData);

      // Reload data to get updated stats - not the most efficient but works
      await dataService.loadSampleData();
      const updatedEntries = dataService.getEntries();
      const updatedStats = dataService.getStatistics(updatedEntries);

      setEntries(updatedEntries);
      setStats(updatedStats);
      setActiveModal(null);
    } catch (error) {
      console.error("Error saving mood entry:", error);
    }
  };

  const openModal = (type) => setActiveModal(type);
  const closeModal = () => setActiveModal(null);
  return (
    <div className="app">
      <Header />

      <Profile
        onLogMoodClick={() => openModal("mood")}
        onStatsClick={() => openModal("stats")}
        onEditProfileClick={() => openModal("editProfile")}
      />

      <main className="app__main">
        <MoodDashboard entries={entries} stats={stats} />
      </main>

      <Footer />

      {/* Render modals directly - ModalForm was removed */}
      {activeModal === "mood" && (
        <MoodModal onSubmit={handleMoodSubmit} onClose={closeModal} />
      )}

      {activeModal === "editProfile" && (
        <EditProfileModal onClose={closeModal} />
      )}

      {activeModal === "stats" && (
        <Stats entries={entries} onClose={closeModal} />
      )}
    </div>
  );
}

export default App;
