// Data service for localStorage operations
// Handles mood entry storage, retrieval, and statistics

const STORAGE_KEY = "mood_tracker_entries";

// Mood icon mapping for display
export const MOOD_ICONS = {
  excited: "/src/assets/Excited.png",
  happy: "/src/assets/Happy.png",
  neutral: "/src/assets/Okay.png",
  sad: "/src/assets/Sad.png",
  angry: "/src/assets/Angry.png",
};

// Mood color mapping
export const MOOD_COLORS = {
  excited: "rgba(214, 172, 66, 1)",
  happy: "rgba(121, 181, 48, 1)",
  neutral: "rgba(177, 71, 201, 1)",
  sad: "rgba(98, 98, 255, 1)",
  angry: "#D85C5C",
};

// Format a Date as YYYY-MM-DD in local time
const formatDateLocal = (date) => {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
};

// Get the weekday name from a Date object
const getWeekdayName = (date) => {
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

// Map user.json sub_moods to our categories/ratings
const mapUserMood = (subMood, mood) => {
  const subKey = (subMood || "").toLowerCase().trim();
  const moodKey = (mood || "").toLowerCase();

  // Map by sub_mood first for more variety
  if (subKey.includes("excited")) return { category: "excited", rating: 5 };
  if (subKey.includes("blessed") || subKey.includes("happy"))
    return { category: "happy", rating: 4 };
  if (subKey.includes("sad")) return { category: "sad", rating: 2 };
  if (subKey.includes("angry")) return { category: "angry", rating: 1 };
  if (subKey.includes("worried") || subKey.includes("anxious"))
    return { category: "sad", rating: 2 };
  if (subKey.includes("meh") || subKey.includes("okay"))
    return { category: "neutral", rating: 3 };

  // Fallback to mood field
  if (moodKey === "good") return { category: "happy", rating: 4 };
  if (moodKey === "normal") return { category: "neutral", rating: 3 };
  if (moodKey === "bad") return { category: "angry", rating: 2 };

  return { category: "neutral", rating: 3 };
};

export const dataService = {
  // Get all mood entries from localStorage
  getEntries: () => {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error("Error loading entries:", error);
      return [];
    }
  },

  // Save a new mood entry to localStorage
  saveEntry: (entry) => {
    try {
      const entries = dataService.getEntries();
      const newEntry = {
        ...entry,
        id: Date.now().toString(),
        timestamp: new Date().toISOString(),
      };
      entries.push(newEntry);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
      return newEntry;
    } catch (error) {
      console.error("Error saving entry:", error);
      return null;
    }
  },

  // Load data from user.json - use actual datetime values
  loadSampleData: async () => {
    try {
      const existing = dataService.getEntries();
      if (existing.length > 0) return existing;

      // Load from user.json
      const responseUser = await fetch("/data/user.json");
      const userData = await responseUser.json();

      if (Array.isArray(userData) && userData.length) {
        // Filter to only user_id 30
        const user30Data = userData.filter((item) => item.user_id === 30);

        // Sort by datetime descending (most recent first)
        const sortedData = user30Data.sort(
          (a, b) => new Date(b.datetime) - new Date(a.datetime)
        );

        // Take the 200 most recent entries
        const recentEntries = sortedData.slice(0, 200);

        // Map to our entry format
        const entries = recentEntries.map((item, index) => {
          const moodMap = mapUserMood(item.sub_mood, item.mood);
          const datetime = new Date(item.datetime);

          return {
            id: `${Date.now()}-${index}`,
            date: formatDateLocal(datetime),
            mood_category: moodMap.category,
            mood_rating: moodMap.rating,
            activities: item.activities ? [item.activities] : [],
            mood_note: item.mood_note || "",
            notes: item.activities || "",
            weekday: getWeekdayName(datetime),
            timestamp: item.datetime,
          };
        });

        if (entries.length > 0) {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
          console.log(`Loaded ${entries.length} entries from user.json`);
          console.log(
            "Date range:",
            entries[0].date,
            "to",
            entries[entries.length - 1].date
          );
          return entries;
        }
      }

      return [];
    } catch (error) {
      console.error("Error loading user.json:", error);
      return [];
    }
  },

  // Calculate statistics from entries
  getStatistics: (entries = null) => {
    const data = entries || dataService.getEntries();

    if (data.length === 0) {
      return {
        average_mood: 0,
        most_common_mood: "N/A",
        total_entries: 0,
      };
    }

    const total = data.reduce((sum, entry) => sum + entry.mood_rating, 0);
    const average = total / data.length;

    const moodCounts = {};
    data.forEach((entry) => {
      moodCounts[entry.mood_category] =
        (moodCounts[entry.mood_category] || 0) + 1;
    });

    const mostCommon = Object.entries(moodCounts).reduce((a, b) =>
      a[1] > b[1] ? a : b
    )[0];

    return {
      average_mood: average.toFixed(1),
      most_common_mood: mostCommon,
      total_entries: data.length,
    };
  },
};
