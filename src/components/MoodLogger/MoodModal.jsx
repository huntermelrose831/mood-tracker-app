import { useState } from "react";
import "./MoodModal.css";

const MOOD_OPTIONS = [
  { value: "excited", label: "😄", name: "Excited", rating: 5 },
  { value: "happy", label: "😊", name: "Happy", rating: 4 },
  { value: "neutral", label: "😐", name: "Neutral", rating: 3 },
  { value: "sad", label: "😢", name: "Sad", rating: 2 },
  { value: "stressed", label: "😰", name: "Stressed", rating: 1 },
];

const ACTIVITY_OPTIONS = [
  "exercise",
  "work",
  "friends",
  "family",
  "hobbies",
  "reading",
  "entertainment",
  "outdoors",
  "relaxation",
];

export default function MoodModal({ onSubmit, onClose }) {
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split("T")[0],
    mood_category: "",
    mood_rating: 0,
    activities: [],
    notes: "",
  });

  const [errors, setErrors] = useState({});

  const handleMoodSelect = (mood) => {
    setFormData({
      ...formData,
      mood_category: mood.value,
      mood_rating: mood.rating,
    });
    setErrors({ ...errors, mood: "" });
  };

  const handleActivityToggle = (activity) => {
    const newActivities = formData.activities.includes(activity)
      ? formData.activities.filter((a) => a !== activity)
      : [...formData.activities, activity];

    setFormData({ ...formData, activities: newActivities });
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.mood_category) {
      newErrors.mood = "Please select a mood";
    }
    if (!formData.date) {
      newErrors.date = "Please select a date";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      onSubmit(formData);
    }
  };

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
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Date</label>
              <input
                type="date"
                value={formData.date}
                onChange={(e) =>
                  setFormData({ ...formData, date: e.target.value })
                }
                max={new Date().toISOString().split("T")[0]}
              />
              {errors.date && <span className="error">{errors.date}</span>}
            </div>

            <div className="form-group">
              <label>How are you feeling?</label>
              <div className="mood-selector">
                {MOOD_OPTIONS.map((mood) => (
                  <button
                    key={mood.value}
                    type="button"
                    className={`mood-option ${
                      formData.mood_category === mood.value ? "selected" : ""
                    }`}
                    onClick={() => handleMoodSelect(mood)}
                  >
                    <span className="mood-emoji">{mood.label}</span>
                    <span className="mood-name">{mood.name}</span>
                  </button>
                ))}
              </div>
              {errors.mood && <span className="error">{errors.mood}</span>}
            </div>

            <div className="form-group">
              <label>Activities (optional)</label>
              <div className="activity-selector">
                {ACTIVITY_OPTIONS.map((activity) => (
                  <button
                    key={activity}
                    type="button"
                    className={`activity-chip ${
                      formData.activities.includes(activity) ? "selected" : ""
                    }`}
                    onClick={() => handleActivityToggle(activity)}
                  >
                    {activity}
                  </button>
                ))}
              </div>
            </div>

            <div className="form-group">
              <label>Notes (optional)</label>
              <textarea
                value={formData.notes}
                onChange={(e) =>
                  setFormData({ ...formData, notes: e.target.value })
                }
                placeholder="How was your day?"
                rows="3"
              />
            </div>

            <button type="submit" className="submit-btn">
              Save Entry
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
