import { useState, useEffect } from "react";
import Header from "../header/header.jsx";
import Profile from "../profile/profile.jsx";
import Footer from "../footer/footer.jsx";
import MoodModal from "../MoodModal/MoodModal.jsx";
import MoodDashboard from "../Dashboard/MoodDashboard.jsx";
import Stats from "../Stats/Stats.jsx";
import { dataService } from "../../services/dataService.js";
import "./App.css";
import ModalForm from "../../ModalForm/ModalForm.jsx";
import ModalContent from "../../ModalForm/ModalContent.jsx";
import EditProfileModal from "../editProfile/editProfileModal.jsx";
import AddMood from "../addMood/addMood.jsx";

function App() {

  // Modal state management
  const [isModalOpen, setIsModalOpen] = useState(false); // Controls mood logging modal visibility
  const [isStatsOpen, setIsStatsOpen] = useState(false); // Controls statistics modal visibility

  // Data state management
  const [entries, setEntries] = useState([]); // Array of 200 mood entries from user.json
  const [stats, setStats] = useState(null); // Calculated statistics (avg mood, most common, total)

  /**
   * Load mood entries on component mount
   *
   * Flow:
   * 1. Fetch and filter user.json data (user_id === 30)
   * 2. Sort by datetime descending (most recent first)
   * 3. Take 200 most recent entries
   * 4. Store in localStorage for persistence
   * 5. Calculate statistics (average mood, most common mood, total entries)
   * 6. Update component state
   *
   * Note: Only runs once on mount. Subsequent data comes from localStorage.
   */

  const [activeModal, setActiveModal] = useState(null);

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
      }
    };

    loadInitialData();
  }, []);


  /**
   * Handle mood logging form submission
   *
   * @param {Object} formData - Form data from MoodModal containing mood details
   *
   * Flow:
   * 1. Save new entry to localStorage with timestamp and unique ID
   * 2. Reload all entries to get updated list
   * 3. Recalculate statistics with new entry included
   * 4. Update state to refresh dashboard display
   * 5. Close the mood logging modal
   */


  const handleMoodSubmit = async (formData) => {
    try {
      dataService.saveEntry(formData);

    // Refresh data to include the newly added entry
    await dataService.loadSampleData();
    const loadedEntries = dataService.getEntries();
    const statistics = dataService.getStatistics(loadedEntries);


    // Update state to re-render dashboard with new entry
    setEntries(loadedEntries);
    setStats(statistics);

    // Hide the mood logging modal
    setIsModalOpen(false);

      setEntries(updatedEntries);
      setStats(updatedStats);
      setActiveModal(null);
    } catch (error) {
      console.error("Error saving mood entry:", error);
    }
  };

  const openModal = (type) => setActiveModal(type);
  const closeModal = () => setActiveModal(null);
  const handleStatsClick = () => {
    setIsStatsOpen(true);
  };

  return (
    <div className="app">
      <Header />

      <Profile
openModal={openModal}
        onLogMoodClick={() => setIsModalOpen(true)}
        onStatsClick={handleStatsClick}
        onEditProfileClick={() => openModal("editProfile")}

      />

      <main className="app__main">
        <MoodDashboard entries={entries} stats={stats} />
      </main>

      <Footer />


      {/* Conditionally rendered modal for logging new moods */}
      {isModalOpen && (
        <MoodModal
          onSubmit={handleMoodSubmit}
          onClose={() => setIsModalOpen(false)}
        />
      )}

      {/* Conditionally rendered modal for viewing statistics */}
      {isStatsOpen && (
        <Stats entries={entries} onClose={() => setIsStatsOpen(false)} />

      )}
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
