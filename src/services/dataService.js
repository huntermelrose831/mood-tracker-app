// localStorage key for mood entries
const MOOD_DATA_STORAGE_KEY = "mood_tracker_entries";

// Icon paths for each mood type - using absolute paths for now
export const MOOD_ICONS = {
  excited: "/src/assets/Excited.png",
  happy: "/src/assets/Happy.png",
  neutral: "/src/assets/Okay.png",
  sad: "/src/assets/Sad.png",
  angry: "/src/assets/Angry.png",
};

// Color scheme for each mood - keeping consistent with the UI
export const MOOD_COLORS = {
  excited: "rgba(214, 172, 66, 1)",
  happy: "rgba(121, 181, 48, 1)",
  neutral: "rgba(177, 71, 201, 1)",
  sad: "rgba(98, 98, 255, 1)",
  angry: "#D85C5C",
};

// Helper function to format dates without timezone issues
// I was getting bitten by timezone conversion before, so doing this manually
const formatDateForStorage = (dateObject) => {
  const year = dateObject.getFullYear();
  const month = String(dateObject.getMonth() + 1).padStart(2, "0");
  const day = String(dateObject.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

// Convert date to weekday name
const getWeekdayFromDate = (dateObject) => {
  const weekdayNames = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  return weekdayNames[dateObject.getDay()];
};

// The raw JSON data has inconsistent mood naming, so we need to normalize it
// This function maps various mood descriptions to our standard 5 categories
const normalizeMoodData = (subMoodText, primaryMood) => {
  const submoodLower = (subMoodText || "").toLowerCase().trim();
  const primaryMoodLower = (primaryMood || "").toLowerCase();

  // Check sub-mood first since it's more specific
  if (submoodLower.includes("excited"))
    return { category: "excited", rating: 5 };
  if (submoodLower.includes("blessed") || submoodLower.includes("happy")) {
    return { category: "happy", rating: 4 };
  }
  if (submoodLower.includes("sad")) return { category: "sad", rating: 2 };
  if (submoodLower.includes("angry")) return { category: "angry", rating: 1 };
  if (submoodLower.includes("worried") || submoodLower.includes("anxious")) {
    return { category: "sad", rating: 2 }; // Treating anxiety as sad for now
  }
  if (submoodLower.includes("meh") || submoodLower.includes("okay")) {
    return { category: "neutral", rating: 3 };
  }

  // Fall back to primary mood if sub-mood doesn't match
  if (primaryMoodLower === "good") return { category: "happy", rating: 4 };
  if (primaryMoodLower === "normal") return { category: "neutral", rating: 3 };
  if (primaryMoodLower === "bad") return { category: "angry", rating: 2 };

  // Default to neutral if we can't categorize
  return { category: "neutral", rating: 3 };
};

export const dataService = {
  // Retrieve all mood entries from browser storage
  getEntries: () => {
    try {
      const storedData = localStorage.getItem(MOOD_DATA_STORAGE_KEY);
      return storedData ? JSON.parse(storedData) : [];
    } catch (parseError) {
      console.error("Failed to parse stored mood entries:", parseError);
      return []; // Return empty array if data is corrupted
    }
  },

  // Add a new mood entry to storage
  saveEntry: (entryData) => {
    try {
      const currentEntries = dataService.getEntries();

      // Create new entry with generated ID and timestamp
      const newMoodEntry = {
        ...entryData,
        id: Date.now().toString(), // Simple ID generation
        timestamp: new Date().toISOString(),
      };

      currentEntries.push(newMoodEntry);
      localStorage.setItem(
        MOOD_DATA_STORAGE_KEY,
        JSON.stringify(currentEntries)
      );

      return newMoodEntry;
    } catch (storageError) {
      console.error("Failed to save mood entry:", storageError);
      return null;
    }
  },

  // Load demo data from the JSON file (only loads if no data exists)
  loadSampleData: async () => {
    try {
      const existingEntries = dataService.getEntries();

      // Skip loading if we already have data
      if (existingEntries.length > 0) {
        return existingEntries;
      }

      console.log("Loading sample data from user.json...");
      const userDataResponse = await fetch("/data/user.json");
      const allUserData = await userDataResponse.json();

      if (Array.isArray(allUserData) && allUserData.length > 0) {
        // Filter to only user 30's entries for this demo
        const targetUserEntries = allUserData.filter(
          (entry) => entry.user_id === 30
        );

        // Sort by date (newest first) and limit to recent entries
        const sortedByDate = targetUserEntries.sort(
          (entryA, entryB) =>
            new Date(entryB.datetime) - new Date(entryA.datetime)
        );
        const limitedEntries = sortedByDate.slice(0, 416); // Cap at 416 entries

        // Transform raw data into our format
        const processedEntries = limitedEntries.map((rawEntry, index) => {
          const moodInfo = normalizeMoodData(rawEntry.sub_mood, rawEntry.mood);
          const entryDate = new Date(rawEntry.datetime);

          return {
            id: `demo-${Date.now()}-${index}`, // Unique ID for demo entries
            date: formatDateForStorage(entryDate),
            mood_category: moodInfo.category,
            mood_rating: moodInfo.rating,
            activities: rawEntry.activities ? [rawEntry.activities] : [],
            mood_note: rawEntry.mood_note || "",
            notes: rawEntry.activities || "", // Using activities as notes for now
            weekday: getWeekdayFromDate(entryDate),
            timestamp: rawEntry.datetime,
          };
        });

        // Save processed entries to storage
        if (processedEntries.length > 0) {
          localStorage.setItem(
            MOOD_DATA_STORAGE_KEY,
            JSON.stringify(processedEntries)
          );
          console.log(`Loaded ${processedEntries.length} sample entries`);
          return processedEntries;
        }
      }

      console.log("No valid sample data found");
      return [];
    } catch (loadError) {
      console.error("Error loading sample data:", loadError);
      return [];
    }
  },

  // Calculate summary statistics from entries
  getStatistics: (entriesData = null) => {
    const entries = entriesData || dataService.getEntries();

    // Handle empty data case
    if (entries.length === 0) {
      return {
        average_mood: 0,
        most_common_mood: "N/A",
        total_entries: 0,
      };
    }

    // Calculate average mood rating
    const totalMoodRating = entries.reduce((sum, entry) => {
      return sum + entry.mood_rating;
    }, 0);
    const averageMood = totalMoodRating / entries.length;

    // Count occurrences of each mood category
    const moodFrequencyMap = {};
    entries.forEach((entry) => {
      const moodType = entry.mood_category;
      moodFrequencyMap[moodType] = (moodFrequencyMap[moodType] || 0) + 1;
    });

    // Find the most frequent mood
    const mostFrequentMood = Object.entries(moodFrequencyMap).reduce(
      (currentMax, [mood, count]) => {
        return count > currentMax[1] ? [mood, count] : currentMax;
      }
    )[0];

    return {
      average_mood: averageMood.toFixed(1),
      most_common_mood: mostFrequentMood,
      total_entries: entries.length,
    };
  },
};
