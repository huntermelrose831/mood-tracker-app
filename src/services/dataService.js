const MOOD_STORAGE_KEY = "mood_tracker_entries";
const PROFILE_STORAGE_KEY = "mood_tracker_profile";
import Avatar from "../assets/Avatar.jpg";

// TODO: maybe we should move these to a config file later?
export const MOOD_ICONS = {
  excited: "/src/assets/Excited.png",
  happy: "/src/assets/Happy.png",
  neutral: "/src/assets/Okay.png",
  sad: "/src/assets/Sad.png",
  angry: "/src/assets/Angry.png",
};

export const MOOD_COLORS = {
  excited: "rgba(214, 172, 66, 1)",
  happy: "rgba(121, 181, 48, 1)",
  neutral: "rgba(177, 71, 201, 1)",
  sad: "rgba(98, 98, 255, 1)",
  angry: "#D85C5C",
};

// format dates properly
const formatDateForStorage = (date) => {
  let year = date.getFullYear();
  let month = String(date.getMonth() + 1).padStart(2, "0");
  let day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const getWeekdayFromDate = (date) => {
  const days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  return days[date.getDay()];
};

// The imported JSON data has really inconsistent mood naming conventions
// This helper tries to normalize everything into our 5 categories
const normalizeMoodData = (subMood, primaryMood) => {
  let submoodText = (subMood || "").toLowerCase().trim();
  let primaryMoodText = (primaryMood || "").toLowerCase();

  if (submoodText.includes("excited")) {
    return { category: "excited", rating: 5 };
  }
  if (submoodText.includes("blessed") || submoodText.includes("happy")) {
    return { category: "happy", rating: 4 };
  }
  if (submoodText.includes("sad")) {
    return { category: "sad", rating: 2 };
  }
  if (submoodText.includes("angry")) {
    return { category: "angry", rating: 1 };
  }
  // I'm treating worried/anxious as sad for now - might want to revisit this
  if (submoodText.includes("worried") || submoodText.includes("anxious")) {
    return { category: "sad", rating: 2 };
  }
  if (submoodText.includes("meh") || submoodText.includes("okay")) {
    return { category: "neutral", rating: 3 };
  }

  if (primaryMoodText === "good") return { category: "happy", rating: 4 };
  if (primaryMoodText === "normal") return { category: "neutral", rating: 3 };
  if (primaryMoodText === "bad") return { category: "angry", rating: 2 };

  return { category: "neutral", rating: 3 };
};

export const dataService = {
  getEntries: () => {
    try {
      const data = localStorage.getItem(MOOD_STORAGE_KEY);
      if (data) {
        return JSON.parse(data);
      } else {
        return [];
      }
    } catch (error) {
      console.error("Error parsing stored mood entries:", error);
      return [];
    }
  },

  // Save a new mood entry
  saveEntry: (entry) => {
    try {
      let entries = dataService.getEntries();

      let dateParts = entry.date.split("-");
      let year = dateParts[0];
      let month = dateParts[1];
      let day = dateParts[2];
      let dateObj = new Date(year, month - 1, day);

      let newEntry = {
        ...entry,
        id: Date.now().toString(),
        timestamp: new Date().toISOString(),
        weekday: getWeekdayFromDate(dateObj),
      };

      entries.push(newEntry);
      localStorage.setItem(MOOD_STORAGE_KEY, JSON.stringify(entries));

      return newEntry;
    } catch (error) {
      console.error("Error saving mood entry:", error);
      return null;
    }
  },

  // Get user profile data
  getProfile: () => {
    try {
      let profileData = localStorage.getItem(PROFILE_STORAGE_KEY);
      if (profileData) {
        return JSON.parse(profileData);
      } else {
        // default profile data
        return {
          name: "Claire Romas",
          avatar: Avatar,
        };
      }
    } catch (error) {
      console.error("Error parsing profile data:", error);
      return {
        name: "Claire Romas",
        avatar: "/mood-tracker-app/assets/Avatar.jpg",
      };
    }
  },

  // Save user profile
  saveProfile: (profile) => {
    try {
      localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(profile));
      return profile;
    } catch (error) {
      console.error("Error saving profile:", error);
      return null;
    }
  },

  deleteEntry: (id) => {
    try {
      let entries = dataService.getEntries();
      let filteredEntries = entries.filter((entry) => entry.id !== id);

      localStorage.setItem(MOOD_STORAGE_KEY, JSON.stringify(filteredEntries));
      return true;
    } catch (error) {
      console.error("Error deleting entry:", error);
      return false;
    }
  },

  //parsedata from user.json and load into localStorage
  loadSampleData: async () => {
    try {
      let existingEntries = dataService.getEntries();

      if (existingEntries.length > 0) {
        return existingEntries;
      }

      console.log("Loading sample data from user.json...");
      let response = await fetch(`${import.meta.env.BASE_URL}data/user.json`);
      let userData = await response.json();

      if (Array.isArray(userData) && userData.length > 0) {
        // For demo purposes, just use user 30's data
        let userEntries = userData.filter((entry) => entry.user_id === 30);

        let sortedEntries = userEntries.sort(
          (a, b) => new Date(b.datetime) - new Date(a.datetime)
        );

        let limitedEntries = sortedEntries.slice(0, 416);

        let processedEntries = limitedEntries.map((rawEntry, i) => {
          let moodData = normalizeMoodData(rawEntry.sub_mood, rawEntry.mood);
          let date = new Date(rawEntry.datetime);

          return {
            id: `demo-${Date.now()}-${i}`,
            date: formatDateForStorage(date),
            mood_category: moodData.category,
            mood_rating: moodData.rating,
            activities: rawEntry.activities ? [rawEntry.activities] : [],
            mood_note: rawEntry.mood_note || "",
            notes: rawEntry.activities || "", // using activities as notes for now
            weekday: getWeekdayFromDate(date),
            timestamp: rawEntry.datetime,
          };
        });

        if (processedEntries.length > 0) {
          localStorage.setItem(
            MOOD_STORAGE_KEY,
            JSON.stringify(processedEntries)
          );
          console.log(
            `Successfully loaded ${processedEntries.length} sample entries`
          );
          return processedEntries;
        }
      }

      console.log("No valid sample data found");
      return [];
    } catch (error) {
      console.error("Error loading sample data:", error);
      return [];
    }
  },

  getStatistics: (entries = null) => {
    let data = entries || dataService.getEntries();

    // Edge case: no data
    if (data.length === 0) {
      return {
        average_mood: 0,
        most_common_mood: "N/A",
        total_entries: 0,
      };
    }

    let totalRating = 0;
    for (let i = 0; i < data.length; i++) {
      totalRating += data[i].mood_rating;
    }
    let avgMood = totalRating / data.length;

    let moodCounts = {};
    data.forEach((entry) => {
      let mood = entry.mood_category;
      if (moodCounts[mood]) {
        moodCounts[mood]++;
      } else {
        moodCounts[mood] = 1;
      }
    });

    let mostCommonMood = "";
    let maxCount = 0;
    for (let mood in moodCounts) {
      if (moodCounts[mood] > maxCount) {
        maxCount = moodCounts[mood];
        mostCommonMood = mood;
      }
    }

    return {
      average_mood: avgMood.toFixed(1),
      most_common_mood: mostCommonMood,
      total_entries: data.length,
    };
  },
};
