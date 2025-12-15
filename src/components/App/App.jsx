import { useState, useEffect } from "react";
import Header from "../header/header.jsx";
import Profile from "../profile/profile.jsx";
import Footer from "../footer/footer.jsx";
import MoodModal from "../MoodModal/MoodModal.jsx";
import MoodDashboard from "../Dashboard/MoodDashboard.jsx";
import Stats from "../Stats/Stats.jsx";
import EditProfileModal from "../editProfile/editProfile.jsx";
import { dataService } from "../../services/dataService.js";
import "./App.css";

function App() {
  const [activeModal, setActiveModal] = useState(null);
  const [entries, setEntries] = useState([]);
  const [profile, setProfile] = useState({
    name: "Profile Name",
    avatar: "/mood-tracker-app/assets/Avatar.png",
  });
  const [stats, setStats] = useState(null);
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        await dataService.loadSampleData();
        const allEntries = dataService.getEntries();
        const currentStats = dataService.getStatistics(allEntries);
        const savedProfile = dataService.getProfile();

        setEntries(allEntries);
        setStats(currentStats);
        setProfile(savedProfile);
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

  const handleDeleteEntry = (entryId) => {
    try {
      dataService.deleteEntry(entryId);
      const updatedEntries = dataService.getEntries();
      const updatedStats = dataService.getStatistics(updatedEntries);

      setEntries(updatedEntries);
      setStats(updatedStats);
    } catch (error) {
      console.error("Error deleting mood entry:", error);
    }
  };

  const openModal = (type) => setActiveModal(type);
  const closeModal = () => setActiveModal(null);
  const handleSaveProfile = (updatedProfile) => {
    try {
      dataService.saveProfile(updatedProfile);
      setProfile(updatedProfile);
      setActiveModal(null);
    } catch (error) {
      console.error("Error saving profile:", error);
    }
  };
  return (
    <div className="app">
      <Header />

      <Profile
        profile={profile}
        onLogMoodClick={() => openModal("mood")}
        onStatsClick={() => openModal("stats")}
        onEditProfileClick={() => openModal("editProfile")}
      />

      <main className="app__main">
        <MoodDashboard
          entries={entries}
          stats={stats}
          onDelete={handleDeleteEntry}
        />
      </main>

      <Footer />

      {/* Render modals directly - ModalForm was removed */}
      {activeModal === "mood" && (
        <MoodModal onSubmit={handleMoodSubmit} onClose={closeModal} />
      )}

      {activeModal === "editProfile" && (
        <EditProfileModal onClose={closeModal} onSave={handleSaveProfile} />
      )}

      {activeModal === "stats" && (
        <Stats entries={entries} onClose={closeModal} />
      )}
    </div>
  );
}

export default App;
