import "./MoodDashboard.css";

export default function MoodDashboard({ entries, stats }) {
  // Sample week days for the grid
  const weekDays = [
    { day: "Mon", date: "12/9" },
    { day: "Tue", date: "12/10" },
    { day: "Wed", date: "12/11" },
    { day: "Thu", date: "12/12" },
    { day: "Fri", date: "12/13" },
    { day: "Sat", date: "12/14" },
    { day: "Sun", date: "12/15" },
  ];

  return (
    <div className="mood-dashboard">
      <div className="dashboard-header">
        <h2>*A mood for every day of the week*</h2>
      </div>

      <div className="mood-grid">
        {weekDays.map((day, index) => (
          <div key={index} className="mood-card">
            {index === 0 ? (
              <div className="add-mood-card">
                <p className="day-label">{day.day}</p>
                <p className="date-label">{day.date}</p>
              </div>
            ) : (
              <div className="empty-mood-card">
                <p className="day-label">{day.day}</p>
                <p className="date-label">{day.date}</p>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="pagination-dots">
        <span className="dot active"></span>
        <span className="dot"></span>
        <span className="dot"></span>
      </div>
    </div>
  );
}