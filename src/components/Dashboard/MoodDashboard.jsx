import { useState } from "react";
import "./MoodDashboard.css";
import ExcitedIcon from "../../assets/Excited.png";
import HappyIcon from "../../assets/Happy.png";
import OkayIcon from "../../assets/Okay.png";
import SadIcon from "../../assets/Sad.png";
import AngryIcon from "../../assets/Angry.png";

const MOOD_ICONS = {
  excited: ExcitedIcon,
  happy: HappyIcon,
  neutral: OkayIcon,
  sad: SadIcon,
  angry: AngryIcon,
  calm: SadIcon,
};

const MOOD_COLORS = {
  excited: "rgba(214, 172, 66, 1)",
  happy: "rgba(121, 181, 48, 1)",
  neutral: "rgba(177, 71, 201, 1)",
  sad: "rgba(98, 98, 255, 1)",
  angry: "#D85C5C",
  calm: "rgba(98, 98, 255, 1)",
};

const MOOD_COLORS_EXPANDED = {
  excited: "#FFD97B",
  happy: "#CBFF8D",
  neutral: "#EA8CFF",
  sad: "#8CD7FF",
  angry: "#FF8C8C",
  calm: "#8CD7FF",
};

export default function MoodDashboard({ entries }) {
  const [expandedCard, setExpandedCard] = useState(null);
  const [visibleCount, setVisibleCount] = useState(12);

  // Instead of generating dates, use the actual entries directly
  // Sort entries by date descending (most recent first)
  const sortedEntries = [...entries].sort(
    (a, b) => new Date(b.date) - new Date(a.date)
  );

  // Take only the number of visible entries
  const visibleEntries = sortedEntries.slice(0, visibleCount);

  // Map entries to card data
  const weekDays = visibleEntries.map((entry) => {
    // Parse date as local time to avoid timezone shift
    const [year, month, day] = entry.date.split("-");
    const date = new Date(year, month - 1, day);
    const shortDate = `${date.getMonth() + 1}/${date.getDate()}`;

    return {
      day: entry.weekday,
      date: shortDate,
      fullDate: entry.date,
      mood: entry.mood_category,
      emoji: MOOD_ICONS[entry.mood_category],
      color: MOOD_COLORS[entry.mood_category],
      mood_note: entry.mood_note || "",
      notes: entry.notes || "No notes for this day",
      activities: entry.activities || [],
    };
  });

  const handleCardClick = (index) => {
    if (weekDays[index].mood) {
      setExpandedCard(expandedCard === index ? null : index);
    }
  };

  return (
    <div className="mood-dashboard">
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
                backgroundColor:
                  expandedCard === index
                    ? MOOD_COLORS_EXPANDED[day.mood]
                    : day.color,
              }}
            >
              {day.mood ? (
                expandedCard === index ? (
                  <div className="mood-dashboard__card-details">
                    <h3 className="mood-dashboard__card-weekday">{day.day}</h3>
                    <h3 className="mood-dashboard__card-date">{day.date}</h3>
                    {day.mood_note && (
                      <p className="mood-dashboard__card-moodnote">
                        {day.mood_note}
                      </p>
                    )}
                    <p className="mood-dashboard__card-notes">{day.notes}</p>
                  </div>
                ) : (
                  <div className="mood-dashboard__emoji-container">
                    <img
                      src={day.emoji}
                      alt={day.mood}
                      className="mood-dashboard__emoji"
                    />
                  </div>
                )
              ) : (
                <>
                  <p className="mood-dashboard__day-label">{day.day}</p>
                  <p className="mood-dashboard__date-label">{day.date}</p>
                </>
              )}
            </div>
          </div>
        ))}
      </div>

      {visibleCount < entries.length && (
        <button
          className="mood-dashboard__load-more"
          onClick={() => setVisibleCount((prev) => prev + 12)}
        >
          Show More
        </button>
      )}
    </div>
  );
}
