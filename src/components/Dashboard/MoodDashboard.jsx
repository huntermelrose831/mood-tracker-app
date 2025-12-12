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
      <div className="mood-dashboard__header">
        <h2 className="mood-dashboard__title">
          *A mood for every day of the week*
        </h2>
      </div>

      <div className="mood-dashboard__grid">
        {weekDays.map((day, index) => (
          <div key={index} className="mood-dashboard__card">
            {index === 0 ? (
              <div className="mood-dashboard__card-content mood-dashboard__card-content--add">
                <p className="mood-dashboard__day-label">{day.day}</p>
                <p className="mood-dashboard__date-label">{day.date}</p>
              </div>
            ) : (
              <div className="mood-dashboard__card-content mood-dashboard__card-content--empty">
                <p className="mood-dashboard__day-label">{day.day}</p>
                <p className="mood-dashboard__date-label">{day.date}</p>
              </div>
            )}
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
