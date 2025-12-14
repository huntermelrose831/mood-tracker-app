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

function App() {

  const [isOpen, setIsOpen] = useState(false);
  const [view, setView] = useState("dashboard");
  const [modal, setModal] = useState(""); // 'dashboard' or 'stats'


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

  const handleStatsClick = () => {
    setModal("stats");
  };
  const handleMoodClick = () => {
    setModal("mood");
  }
  const handleEditMoodClick = () => {
    setModal("editMood");
  }
  const handleEditProfileClick = () => {
    setModal("editProfile");
  }
  const handleAddClick = () => {
    setModal("add");
  }
  return (
    <div className="app">

      <Header
        onLogMoodClick={() => setModal("mood")}
        onStatsClick={() => setView(view === "stats" ? "dashboard" : "stats")}
        currentView={view}

     
      />
      
      <Profile
        handleMoodClick={() => setModal("mood")}
        handleStatsClick={handleStatsClick}

      />

     
      <main className="app__main">
        <MoodDashboard entries={entries} stats={stats} />
      </main>

      {/* Footer with copyright information */}
      <Footer />


      <ModalForm isOpen={isOpen} onClose={() => setIsOpen(false)}>
        <ModalContent modal={modal}/>
      </ModalForm>

  

      
   

      {modal === "mood" && (
        <MoodModal
          onSubmit={handleMoodSubmit}
          onClose={() => setIsOpen(false)}
        />
      )}

      {modal === "stats" && (
        <Stats entries={entries} onClose={() => setIsOpen(false)} />
      )}

      {modal === "editMood" && (
        <EditMoodModal
          onSubmit={handleMoodSubmit}
          onClose={() => setIsOpen(false)}
        />
      )}

      {modal === "editProfile" && (
        <EditProfileModal
          onClose={() => setIsOpen(false)}
        />
      )}

      {modal === "add" && ( 
        <AddMood
          onSubmit={handleMoodSubmit}
          onClose={() => setIsOpen(false)}
        />
      )}


    </div>
  );
}



export default App;
