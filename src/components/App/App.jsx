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
  const [view, setView] = useState("dashboard");
  const [activeModal, setActiveModal] = useState(null); // 'dashboard' or 'stats'

  // Data state management
  const [entries, setEntries] = useState([]); // Array of 200 mood entries from user.json
  const [stats, setStats] = useState(null); // Calculated statistics (avg mood, most common, total)

  useEffect(() => {
    const loadData = async () => {
      // Loads from user.json if localStorage is empty, otherwise returns cached data
      await dataService.loadSampleData();

      // Retrieve the 200 entries from localStorage
      const loadedEntries = dataService.getEntries();
      console.log("Loaded entries:", loadedEntries);

      // Calculate statistics for the Stats component
      const statistics = dataService.getStatistics(loadedEntries);

      // Update state to trigger re-render of dashboard and enable stats modal
      setEntries(loadedEntries);
      setStats(statistics);
    };

    loadData();
    // Disable exhaustive-deps: loadData is only needed on mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleMoodSubmit = async (formData) => {
    // Persist new entry to localStorage with generated ID and timestamp
    const newEntry = dataService.saveEntry(formData);
    console.log("Mood submitted:", newEntry);

    // Refresh data to include the newly added entry
    await dataService.loadSampleData();
    const loadedEntries = dataService.getEntries();
    const statistics = dataService.getStatistics(loadedEntries);

    // Update state to re-render dashboard with new entry
    setEntries(loadedEntries);
    setStats(statistics);

    // Hide the mood logging modal
    setIsOpen(false);
  };

  const openModal = (type) => {
    setActiveModal(type);
  };
  const closeModal = () => {
    setActiveModal(null);
  };
  const handleStatsClick = () => {
    setActiveModal("stats");
  };
  const handleMoodClick = () => {
    setActiveModal("mood");
  };
  const handleEditMoodClick = () => {
    setActiveModal("editMood");
  };
  const handleEditProfileClick = () => {
    setActiveModal("editProfile");
  };
  const handleAddClick = () => {
    setActiveModal("add");
  };
  
  return (
    <div className="app">
      <Header />

      <Profile
        onLogMoodClick={() => openModal("mood")}
        onStatsClick={() => openModal("stats")}
        handleEditProfileClick={() => openModal("editProfile")}
      />

      <main className="app__main">
        <MoodDashboard entries={entries} stats={stats} />
      </main>

      {/* Footer with copyright information */}
      <Footer />

      <ModalForm isOpen={activeModal !== null} onClose={closeModal}>
        {activeModal === "editMood" && (
          <EditMoodModal onSubmit={handleMoodSubmit} closeModal={closeModal} />
        )}
        {activeModal === "mood" && (
          <MoodModal onSubmit={handleMoodSubmit} closeModal={closeModal} />
        )}
        {activeModal === "editProfile" && (
          <EditProfileModal closeModal={closeModal} />
        )}
        {activeModal === "add" && (
          <AddMood onSubmit={handleMoodSubmit} closeModal={closeModal} />
        )}
      </ModalForm>

      {activeModal === "stats" && (
        <Stats
          entries={entries}
          onClose={() => setIsOpen(false)}
          closeModal={closeModal}
        />
      )}
    </div>
  );
}

export default App;
