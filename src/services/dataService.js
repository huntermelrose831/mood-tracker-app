/**
 * Data Service Module
 *
 * Central data management layer for the mood tracker application.
 *
 * Responsibilities:
 * - Load and filter mood data from user.json (user_id === 30)
 * - Store and retrieve entries from localStorage
 * - Map mood categories from user.json format to app format
 * - Calculate statistics (averages, counts, most common moods)
 * - Handle date/time formatting and timezone conversions
 *
 * Data Flow:
 * 1. user.json (150K+ entries) → filter user_id 30 → sort by datetime DESC
 * 2. Take 200 most recent → map to app format → store in localStorage
 * 3. App components read from localStorage for fast access
 *
 * localStorage key: "mood_tracker_entries"
 */

const STORAGE_KEY = "mood_tracker_entries";

/**
 * Mood Icon Mapping
 * Maps mood categories to their corresponding image assets
 */
export const MOOD_ICONS = {
  excited: "/src/assets/Excited.png",
  happy: "/src/assets/Happy.png",
  neutral: "/src/assets/Okay.png",
  sad: "/src/assets/Sad.png",
  angry: "/src/assets/Angry.png",
};

/**
 * Mood Color Mapping
 * Default colors for mood cards (darker shades)
 */
export const MOOD_COLORS = {
  excited: "rgba(214, 172, 66, 1)",
  happy: "rgba(121, 181, 48, 1)",
  neutral: "rgba(177, 71, 201, 1)",
  sad: "rgba(98, 98, 255, 1)",
  angry: "#D85C5C",
};

/**
 * Format Date as YYYY-MM-DD in Local Timezone
 *
 * Critical: Uses local time to avoid timezone shift bugs.
 * Example: Dec 4 at midnight should display as "12/4", not "12/3"
 *
 * @param {Date} date - JavaScript Date object
 * @returns {string} Formatted date string (e.g., "2024-12-04")
 */
const formatDateLocal = (date) => {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
};

/**
 * Get Weekday Name from Date Object
 *
 * Calculates the correct weekday from the datetime field instead of
 * using the potentially incorrect weekday field from user.json.
 *
 * @param {Date} date - JavaScript Date object
 * @returns {string} Weekday name (e.g., "Monday")
 */
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

/**
 * Map User.json Moods to App Categories
 *
 * Converts mood data from user.json format to our internal format.
 * Prioritizes sub_mood field for variety (excited, blessed, sad, angry, etc.)
 * Falls back to mood field if sub_mood is unavailable.
 *
 * Mood Rating Scale:
 * 5 = Excited (best)
 * 4 = Happy
 * 3 = Neutral/Okay
 * 2 = Sad
 * 1 = Angry (worst)
 *
 * @param {string} subMood - The sub_mood field from user.json
 * @param {string} mood - The mood field from user.json (fallback)
 * @returns {Object} { category: string, rating: number }
 */
const mapUserMood = (subMood, mood) => {
  const subKey = (subMood || "").toLowerCase().trim();
  const moodKey = (mood || "").toLowerCase();

  // Check sub_mood field first for more granular mood detection
  if (subKey.includes("excited")) return { category: "excited", rating: 5 };
  if (subKey.includes("blessed") || subKey.includes("happy"))
    return { category: "happy", rating: 4 };
  if (subKey.includes("sad")) return { category: "sad", rating: 2 };
  if (subKey.includes("angry")) return { category: "angry", rating: 1 };
  if (subKey.includes("worried") || subKey.includes("anxious"))
    return { category: "sad", rating: 2 };
  if (subKey.includes("meh") || subKey.includes("okay"))
    return { category: "neutral", rating: 3 };

  // Fallback to broader mood field if sub_mood doesn't match
  if (moodKey === "good") return { category: "happy", rating: 4 };
  if (moodKey === "normal") return { category: "neutral", rating: 3 };
  if (moodKey === "bad") return { category: "angry", rating: 2 };

  // Default to neutral if nothing matches
  return { category: "neutral", rating: 3 };
};

export const dataService = {
  /**
   * Get All Mood Entries from localStorage
   *
   * Reads the cached mood entries that were loaded from user.json.
   * Returns empty array if localStorage is empty or corrupted.
   *
   * @returns {Array} Array of mood entry objects
   */
  getEntries: () => {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error("Error loading entries:", error);
      return [];
    }
  },

  /**
   * Save New Mood Entry to localStorage
   *
   * Adds a new mood entry with auto-generated ID and timestamp.
   * Appends to existing entries in localStorage.
   *
   * @param {Object} entry - Mood entry data from form submission
   * @returns {Object|null} The saved entry with ID and timestamp, or null on error
   */
  saveEntry: (entry) => {
    try {
      const entries = dataService.getEntries();
      const newEntry = {
        ...entry,
        id: Date.now().toString(), // Unique ID based on timestamp
        timestamp: new Date().toISOString(), // ISO format for consistency
      };
      entries.push(newEntry);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
      return newEntry;
    } catch (error) {
      console.error("Error saving entry:", error);
      return null;
    }
  },

  /**
   * Load Sample Data from user.json
   *
   * Primary data loading function for the application.
   *
   * Process:
   * 1. Check if localStorage already has data (skip if exists)
   * 2. Fetch user.json from /public/data/ directory (150K+ entries)
   * 3. Filter to only user_id === 30 for this demo
   * 4. Sort by datetime descending (newest first)
   * 5. Take top 200 entries
   * 6. Map each entry to app format:
   *    - Convert datetime to local date string
   *    - Map sub_mood to category and rating
   *    - Calculate correct weekday from datetime
   *    - Extract activities and notes
   * 7. Store in localStorage for persistent access
   *
   * @returns {Array} Array of processed mood entries
   */
  loadSampleData: async () => {
    try {
      // Return cached data if available (don't reload unnecessarily)
      const existing = dataService.getEntries();
      if (existing.length > 0) return existing;

      // Fetch the large user.json file from public directory
      const responseUser = await fetch("/data/user.json");
      const userData = await responseUser.json();

      if (Array.isArray(userData) && userData.length) {
        // Filter to specific user for this demo (user_id 30)
        const user30Data = userData.filter((item) => item.user_id === 30);

        // Sort chronologically, newest entries first
        const sortedData = user30Data.sort(
          (a, b) => new Date(b.datetime) - new Date(a.datetime)
        );

        // Limit to 200 most recent entries for performance
        const recentEntries = sortedData.slice(0, 200);

        // Transform user.json format to our app's internal format
        const entries = recentEntries.map((item, index) => {
          // Map mood strings to category and 1-5 rating
          const moodMap = mapUserMood(item.sub_mood, item.mood);
          // Parse datetime string to Date object
          const datetime = new Date(item.datetime);

          return {
            id: `${Date.now()}-${index}`, // Unique identifier
            date: formatDateLocal(datetime), // "YYYY-MM-DD" format
            mood_category: moodMap.category, // "excited", "happy", etc.
            mood_rating: moodMap.rating, // 1-5 scale
            activities: item.activities ? [item.activities] : [], // Array for consistency
            mood_note: item.mood_note || "", // User's written note
            notes: item.activities || "", // Activities for display
            weekday: getWeekdayName(datetime), // Calculated from actual date
            timestamp: item.datetime, // Original ISO timestamp
          };
        });

        // Persist to localStorage and log summary
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

  /**
   * Calculate Statistics from Mood Entries
   *
   * Computes aggregated statistics for the Stats component.
   *
   * Calculations:
   * - Average mood rating (1-5 scale)
   * - Most common mood category (mode)
   * - Total number of entries
   *
   * @param {Array|null} entries - Optional array of entries (uses localStorage if null)
   * @returns {Object} Statistics object { average_mood, most_common_mood, total_entries }
   */
  getStatistics: (entries = null) => {
    const data = entries || dataService.getEntries();

    // Handle empty dataset
    if (data.length === 0) {
      return {
        average_mood: 0,
        most_common_mood: "N/A",
        total_entries: 0,
      };
    }

    // Calculate average mood rating (sum all ratings / count)
    const total = data.reduce((sum, entry) => sum + entry.mood_rating, 0);
    const average = total / data.length;

    // Count occurrences of each mood category
    const moodCounts = {};
    data.forEach((entry) => {
      moodCounts[entry.mood_category] =
        (moodCounts[entry.mood_category] || 0) + 1;
    });

    // Find the mood category with highest count (mode)
    const mostCommon = Object.entries(moodCounts).reduce((a, b) =>
      a[1] > b[1] ? a : b
    )[0];

    return {
      average_mood: average.toFixed(1), // Round to 1 decimal place
      most_common_mood: mostCommon, // Category name string
      total_entries: data.length, // Total count
    };
  },
};
