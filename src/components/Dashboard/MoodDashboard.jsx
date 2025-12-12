import "./MoodDashboard.css";

export default function MoodDashboard({ entries, stats }) {
  // Sample week days for the grid with mood data
  const weekDays = [
    {
      day: "Mon",
      date: "12/9",
      mood: "excited",
      emoji: "😁",
      color: "#D4A747",
    },
    {
      day: "Tue",
      date: "12/10",
      mood: "neutral",
      emoji: "😐",
      color: "#B565D8",
    },
    { day: "Wed", date: "12/11", mood: "happy", emoji: "😊", color: "#f3c11b" },
    { day: "Thu", date: "12/12", mood: "happy", emoji: "😊", color: "#f3c11b" },
    {
      day: "Fri",
      date: "12/13",
      mood: "stressed",
      emoji: "😬",
      color: "#D85C5C",
    },
    { day: "Sat", date: "12/14", mood: "calm", emoji: "😌", color: "#6B8DD6" },
  ];

  return (
    <div className="mood-dashboard">
      <div className="mood-dashboard__grid">
        {weekDays.map((day, index) => (
          <div key={index} className="mood-dashboard__card">
            <div
              className="mood-dashboard__card-content"
              style={{ backgroundColor: day.color }}
            >
              {day.mood ? (
                <div className="mood-dashboard__emoji-container">
                  <div className="mood-dashboard__emoji-circle">
                    <span className="mood-dashboard__emoji">{day.emoji}</span>
                  </div>
                </div>
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

      <div className="mood-dashboard__pagination">
        <span className="mood-dashboard__dot mood-dashboard__dot--active"></span>
        <span className="mood-dashboard__dot"></span>
        <span className="mood-dashboard__dot"></span>
      </div>
    </div>
  );
}
