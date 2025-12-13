import { useState } from "react";
import "./MoodModal.css";

const MOOD_OPTIONS = [
  { value: "excited", label: "😄", name: "Excited", rating: 5 },
  { value: "happy", label: "😊", name: "Happy", rating: 4 },
  { value: "neutral", label: "😐", name: "Neutral", rating: 3 },
  { value: "sad", label: "😢", name: "Sad", rating: 2 },
  { value: "angry", label: "😰", name: "Angry", rating: 1 },
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
      <div className="mood__modal_overlay" onClick={onClose}></div>
      <div className="mood__modal">
        <div className="mood__modal_header">
          <h2 className="mood__modal_title">Log Your Mood</h2>
          <button className="mood__modal_close-button" onClick={onClose}>
            ✕
          </button>
        </div>
        <div className="mood__modal_body">
          <form onSubmit={handleSubmit} className="mood__form">
            <div className="mood__form_group">
              <label className="mood__form_label">Date</label>
              <input
                type="date"
                className="mood__form_input"
                value={formData.date}
                onChange={(e) =>
                  setFormData({ ...formData, date: e.target.value })
                }
                max={new Date().toISOString().split("T")[0]}
              />
              {errors.date && (
                <span className="mood__form_error">{errors.date}</span>
              )}
            </div>

            <div className="mood__form_group">
              <label className="mood__form_label">How are you feeling?</label>
              <div className="mood__form_mood-selector">
                {MOOD_OPTIONS.map((mood) => (
                  <button
                    key={mood.value}
                    type="button"
                    className={`mood__form_mood-option ${
                      formData.mood_category === mood.value
                        ? "mood__form_mood-option--selected"
                        : ""
                    }`}
                    onClick={() => handleMoodSelect(mood)}
                  >
                    <span className="mood__form_mood-emoji">{mood.label}</span>
                    <span className="mood__form_mood-name">{mood.name}</span>
                  </button>
                ))}
              </div>
              {errors.mood && (
                <span className="mood__form_error">{errors.mood}</span>
              )}
            </div>

            <div className="mood__form_group">
              <label className="mood__form_label">Activities (optional)</label>
              <div className="mood__form_activity-selector">
                {ACTIVITY_OPTIONS.map((activity) => (
                  <button
                    key={activity}
                    type="button"
                    className={`mood__form_activity-chip ${
                      formData.activities.includes(activity)
                        ? "mood__form_activity-chip--selected"
                        : ""
                    }`}
                    onClick={() => handleActivityToggle(activity)}
                  >
                    {activity}
                  </button>
                ))}
              </div>
            </div>

            <div className="mood__form_group">
              <label className="mood__form_label">Notes (optional)</label>
              <textarea
                className="mood__form_textarea"
                value={formData.notes}
                onChange={(e) =>
                  setFormData({ ...formData, notes: e.target.value })
                }
                placeholder="How was your day?"
                rows="3"
              />
            </div>

            <button type="submit" className="mood__form_submit-button">
              Save Entry
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
