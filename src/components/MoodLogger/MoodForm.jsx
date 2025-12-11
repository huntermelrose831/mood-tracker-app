// TODO: Implement mood logging form
// Requirements:
// - Date picker
// - Mood selector (emoji buttons)
// - Activities selector
// - Notes textarea
// - Form validation
import "./MoodForm.css";

export default function MoodForm({ onSubmit, onClose }) {
  return (
    <>
      <div className="modal-overlay" onClick={onClose}></div>
      <div className="modal-content">
        <div className="modal-header">
          <h2>Log Your Mood</h2>
          <button className="close-btn" onClick={onClose}>
            ✕
          </button>
        </div>
        <div className="modal-body">
          <p>Form content - TO BE IMPLEMENTED</p>
          {/* TODO: Add form fields here */}
        </div>
      </div>
    </>
  );
}
