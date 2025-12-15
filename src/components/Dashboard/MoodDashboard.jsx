import { useState, useEffect, useRef } from "react";
import "./MoodDashboard.css";
import ExcitedIcon from "../../assets/Excited.png";
import HappyIcon from "../../assets/Happy.png";
import OkayIcon from "../../assets/Okay.png";
import SadIcon from "../../assets/Sad.png";
import AngryIcon from "../../assets/Angry.png";

// Mapping mood types to their corresponding icons
const MOOD_ICONS = {
  excited: ExcitedIcon,
  happy: HappyIcon,
  neutral: OkayIcon,
  sad: SadIcon,
  angry: AngryIcon,
  calm: SadIcon, // Note: using sad icon for calm too - might want to get a dedicated calm icon later
};

// Default colors for each mood state
const MOOD_COLORS = {
  excited: "rgba(214, 172, 66, 1)",
  happy: "rgba(121, 181, 48, 1)",
  neutral: "rgba(177, 71, 201, 1)",
  sad: "rgba(98, 98, 255, 1)",
  angry: "#D85C5C",
  calm: "rgba(98, 98, 255, 1)", // Same as sad for now
};

// Brighter colors when cards are flipped - makes it more engaging
const MOOD_COLORS_EXPANDED = {
  excited: "#FFD97B",
  happy: "#CBFF8D",
  neutral: "#EA8CFF",
  sad: "#8CD7FF",
  angry: "#FF8C8C",
  calm: "#8CD7FF",
};

export default function MoodDashboard({ entries }) {
  const [flippedCards, setFlippedCards] = useState(new Set());
<<<<<<< HEAD
  const [visibleCount, setVisibleCount] = useState(6); // Show 6 cards initially

  // Using ref to keep track of timers so they don't get lost on re-renders
=======
  // Track how many cards to display (starts at 6, increases by 6 on "Show More")
  const [visibleCount, setVisibleCount] = useState(6);
  // Track active timers for auto-flip (Map of index -> timeoutId)
>>>>>>> bdba27e (fix:moodmodal issues)
  const timersRef = useRef(new Map());

  // Sort entries by date (newest first)
  const sortedEntries = [...entries].sort(
    (a, b) => new Date(b.date) - new Date(a.date)
  );

  // Limit entries to max 3 per day to avoid flooding the grid
  // This was getting messy with multiple entries per day
  const limitedEntries = [];
  const entriesPerDay = {}; // Keep track of how many entries we have per day

  for (const entry of sortedEntries) {
    const currentDate = entry.date;

    if (!entriesPerDay[currentDate]) {
      entriesPerDay[currentDate] = 0;
    }

    if (entriesPerDay[currentDate] < 3) {
      limitedEntries.push(entry);
      entriesPerDay[currentDate]++;
    }
  }

  const visibleEntries = limitedEntries.slice(0, visibleCount);

  // Transform entries into the format we need for display
  const displayData = visibleEntries.map((entry) => {
    // Parse the date string to get a proper Date object
    const [year, month, day] = entry.date.split("-");
    const dateObj = new Date(year, month - 1, day); // month is 0-indexed in JS
    const shortDateFormat = `${dateObj.getMonth() + 1}/${dateObj.getDate()}`;

    return {
      day: entry.weekday,
      date: shortDateFormat,
      fullDate: entry.date,
      mood: entry.mood_category,
      emoji: MOOD_ICONS[entry.mood_category],
      color: MOOD_COLORS[entry.mood_category],
      mood_note: entry.mood_note || "",
      notes: entry.notes || "No notes for this day",
      activities: entry.activities || [],
    };
  });

  const handleCardFlip = (cardIndex) => {
    // Only allow flipping if the card has mood data
    if (!displayData[cardIndex].mood) return;

    setFlippedCards((previousFlipped) => {
      const newFlippedSet = new Set(previousFlipped);

      if (newFlippedSet.has(cardIndex)) {
        // Card is already flipped, so flip it back
        newFlippedSet.delete(cardIndex);

        // Clear any existing timer for this card
        if (timersRef.current.has(cardIndex)) {
          clearTimeout(timersRef.current.get(cardIndex));
          timersRef.current.delete(cardIndex);
        }
      } else {
        // Card is not flipped, so flip it
        newFlippedSet.add(cardIndex);

        // Clear any existing timer first (just in case)
        if (timersRef.current.has(cardIndex)) {
          clearTimeout(timersRef.current.get(cardIndex));
        }

        // Set timer to auto-flip back after 60 seconds
        // 60 seconds should be enough time to read the details
        const autoFlipTimer = setTimeout(() => {
          setFlippedCards((currentFlipped) => {
            const updated = new Set(currentFlipped);
            updated.delete(cardIndex);
            return updated;
          });
          timersRef.current.delete(cardIndex);
        }, 60000);

        timersRef.current.set(cardIndex, autoFlipTimer);
      }

      return newFlippedSet;
    });
  };

  // Cleanup timers when component unmounts
  useEffect(() => {
    const activeTimers = timersRef.current;

    return () => {
      // Clear all active timers
      activeTimers.forEach((timer) => clearTimeout(timer));
      activeTimers.clear();
    };
  }, []);

  const loadMoreEntries = () => {
    setVisibleCount((prevCount) => prevCount + 6); // Load 6 more entries
  };

  /**
   * Cleanup effect - clear all timers when component unmounts
   */
  useEffect(() => {
    return () => {
      timersRef.current.forEach((timerId) => clearTimeout(timerId));
      timersRef.current.clear();
    };
  }, []);

  return (
    <div className="mood-dashboard">
      <div className="mood-dashboard__grid">
        {displayData.map((dayData, index) => (
          <div
            key={index} // Could use fullDate as key but index works for now
            className="mood-dashboard__card"
            onClick={() => handleCardFlip(index)}
          >
            <div
              className="mood-dashboard__card-content"
              style={{
                backgroundColor: flippedCards.has(index)
                  ? MOOD_COLORS_EXPANDED[dayData.mood]
                  : dayData.color,
              }}
            >
              {dayData.mood ? (
                flippedCards.has(index) ? (
                  // Flipped state - show details
                  <div className="mood-dashboard__card-details">
                    {dayData.mood_note && (
                      <p className="mood-dashboard__card-moodnote">
                        {dayData.mood_note}
                      </p>
                    )}

                    <p className="mood-dashboard__card-notes">
                      {dayData.notes}
                    </p>
                  </div>
                ) : (
                  // Normal state - show emoji with weekday and date
                  <div className="mood-dashboard__emoji-container">
                    <h3 className="mood-dashboard__card-weekday">
                      {dayData.day}
                    </h3>
                    <img
                      src={dayData.emoji}
                      alt={dayData.mood}
                      className="mood-dashboard__emoji"
                    />
                    <h3 className="mood-dashboard__card-date">
                      {dayData.date}
                    </h3>
                  </div>
                )
              ) : (
                // No mood data - show empty state
                <>
                  <p className="mood-dashboard__day-label">{dayData.day}</p>
                  <p className="mood-dashboard__date-label">{dayData.date}</p>
                </>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Show load more button if there are more entries to display */}
      {visibleCount < limitedEntries.length && (
        <div className="mood-dashboard__button-container">
          <button
            className="mood-dashboard__load-more"
            onClick={loadMoreEntries}
          >
            Show More
          </button>
        </div>
      )}
    </div>
  );
}
