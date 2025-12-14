/**
 * Mood Dashboard Component
 *
 * Main content area displaying mood entries as interactive cards.
 *
 * Features:
 * - Displays 200 mood entries from user.json (user_id 30)
 * - Pagination: Shows 12 cards initially, "Show More" button loads +12
 * - Click-to-expand: Cards expand to show mood notes and activities
 * - Color transitions: Darker default color, lighter when expanded
 * - Sorted by date descending (newest first)
 *
 * Props:
 * @param {Array} entries - Array of mood entry objects from App.jsx
 */

import { useState } from "react";
import "./MoodDashboard.css";
import ExcitedIcon from "../../assets/Excited.png";
import HappyIcon from "../../assets/Happy.png";
import OkayIcon from "../../assets/Okay.png";
import SadIcon from "../../assets/Sad.png";
import AngryIcon from "../../assets/Angry.png";

// Mood category to icon mapping
const MOOD_ICONS = {
  excited: ExcitedIcon,
  happy: HappyIcon,
  neutral: OkayIcon,
  sad: SadIcon,
  angry: AngryIcon,
  calm: SadIcon, // Using sad icon as fallback
};

// Default mood card colors (darker shades)
const MOOD_COLORS = {
  excited: "rgba(214, 172, 66, 1)",
  happy: "rgba(121, 181, 48, 1)",
  neutral: "rgba(177, 71, 201, 1)",
  sad: "rgba(98, 98, 255, 1)",
  angry: "#D85C5C",
  calm: "rgba(98, 98, 255, 1)",
};

// Expanded mood card colors (lighter shades for contrast)
const MOOD_COLORS_EXPANDED = {
  excited: "#FFD97B",
  happy: "#CBFF8D",
  neutral: "#EA8CFF",
  sad: "#8CD7FF",
  angry: "#FF8C8C",
  calm: "#8CD7FF",
};

export default function MoodDashboard({ entries }) {
  // Track which card is currently expanded (null = none expanded)
  const [expandedCard, setExpandedCard] = useState(null);
  // Track how many cards to display (starts at 12, increases by 12 on "Show More")
  const [visibleCount, setVisibleCount] = useState(12);

  /**
   * Sort entries by date descending (newest first)
   * Uses spread operator to avoid mutating original array
   */
  const sortedEntries = [...entries].sort(
    (a, b) => new Date(b.date) - new Date(a.date)
  );

  /**
   * Limit to 3 cards per day
   * Group entries by date and take max 3 entries per day
   */
  const limitedEntries = [];
  const dateCount = {};

  for (const entry of sortedEntries) {
    if (!dateCount[entry.date]) {
      dateCount[entry.date] = 0;
    }

    if (dateCount[entry.date] < 3) {
      limitedEntries.push(entry);
      dateCount[entry.date]++;
    }
  }

  // Slice array to only show the number of visible entries
  const visibleEntries = limitedEntries.slice(0, visibleCount);

  /**
   * Transform entries into card data format
   *
   * Process:
   * 1. Parse date string as local time to avoid timezone shifts
   * 2. Format as short date (MM/DD)
   * 3. Extract mood category, notes, and activities
   * 4. Map to icon and color based on mood
   */
  const weekDays = visibleEntries.map((entry) => {
    // Parse date components manually to avoid timezone conversion
    // Example: "2024-12-04" → Date(2024, 11, 4) in local time
    const [year, month, day] = entry.date.split("-");
    const date = new Date(year, month - 1, day); // month - 1 because JS months are 0-indexed
    const shortDate = `${date.getMonth() + 1}/${date.getDate()}`; // Format as "12/4"

    return {
      day: entry.weekday, // "Monday", "Tuesday", etc.
      date: shortDate, // "12/4"
      fullDate: entry.date, // "2024-12-04" (for reference)
      mood: entry.mood_category, // "excited", "happy", etc.
      emoji: MOOD_ICONS[entry.mood_category], // PNG image path
      color: MOOD_COLORS[entry.mood_category], // Default darker color
      mood_note: entry.mood_note || "", // User's written note
      notes: entry.notes || "No notes for this day", // Activities or fallback message
      activities: entry.activities || [], // Array of activity strings
    };
  });

  /**
   * Handle Card Click
   *
   * Toggles card between collapsed and expanded states.
   * Only allows expansion if the card has mood data.
   *
   * @param {number} index - Index of the clicked card in weekDays array
   */
  const handleCardClick = (index) => {
    if (weekDays[index].mood) {
      // Toggle: if already expanded, collapse it; otherwise, expand it
      setExpandedCard(expandedCard === index ? null : index);
    }
  };

  return (
    <div className="mood-dashboard">
      {/* Grid layout for mood cards (responsive) */}
      <div className="mood-dashboard__grid">
        {weekDays.map((day, index) => (
          <div
            key={index}
            className="mood-dashboard__card"
            onClick={() => handleCardClick(index)}
          >
            <div
              className="mood-dashboard__card-content"
              style={{
                // Dynamic background color: lighter when expanded, darker when collapsed
                backgroundColor:
                  expandedCard === index
                    ? MOOD_COLORS_EXPANDED[day.mood]
                    : day.color,
              }}
            >
              {day.mood ? (
                // Card has mood data - show either expanded or collapsed view
                expandedCard === index ? (
                  // EXPANDED VIEW: Shows full details with text
                  <div className="mood-dashboard__card-details">
                    <h3 className="mood-dashboard__card-weekday">{day.day}</h3>
                    <h3 className="mood-dashboard__card-date">{day.date}</h3>
                    {/* Show mood note if available */}
                    {day.mood_note && (
                      <p className="mood-dashboard__card-moodnote">
                        {day.mood_note}
                      </p>
                    )}
                    {/* Show activities or default message */}
                    <p className="mood-dashboard__card-notes">{day.notes}</p>
                  </div>
                ) : (
                  // COLLAPSED VIEW: Shows only mood emoji icon
                  <div className="mood-dashboard__emoji-container">
                    <img
                      src={day.emoji}
                      alt={day.mood}
                      className="mood-dashboard__emoji"
                    />
                  </div>
                )
              ) : (
                // NO MOOD DATA: Shows empty card with day/date labels
                <>
                  <p className="mood-dashboard__day-label">{day.day}</p>
                  <p className="mood-dashboard__date-label">{day.date}</p>
                </>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Show "Show More" button if there are more entries to display */}
      {visibleCount < limitedEntries.length && (
        <button
          className="mood-dashboard__load-more"
          onClick={() => setVisibleCount((prev) => prev + 12)} // Load 12 more cards
        >
          Show More
        </button>
      )}
    </div>
  );
}
