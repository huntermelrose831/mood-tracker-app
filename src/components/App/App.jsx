import { useState, useEffect } from "react";
import Header from "../header/header.jsx";
import Profile from "../profile/profile.jsx";
import Footer from "../footer/footer.jsx";
import MoodModal from "../MoodLogger/MoodModal.jsx";
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
  };

  /**
   * Handle Stats button click
   * Opens the statistics modal overlay
   */
  const handleStatsClick = () => {
    setIsStatsOpen(true);
  };

  /**
   * Component Hierarchy:
   *
   * App (root)
   * ├── Header (HollyMood logo, fixed at top)
   * ├── Profile (avatar, name, action buttons)
   * ├── MoodDashboard (main content: 200 mood cards with pagination)
   * ├── Footer (copyright info)
   * └── Modals (conditionally rendered)
   *     ├── MoodModal (mood logging form)
   *     └── Stats (Chart.js visualizations)
   */
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
    </div>
  );
}

export default App;
