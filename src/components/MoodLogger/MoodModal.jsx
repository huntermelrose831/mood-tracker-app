import { useState } from "react";
import "./MoodModal.css";
import ExcitedIcon from "../../assets/Excited.png";
import HappyIcon from "../../assets/Happy.png";
import OkayIcon from "../../assets/Okay.png";
import SadIcon from "../../assets/Sad.png";
import AngryIcon from "../../assets/Angry.png";

const MOOD_OPTIONS = [
  {
    value: "excited",
    icon: ExcitedIcon,
    name: "Excited",
    rating: 5,
    gradient: "linear-gradient(180deg, #FFFBEE 0%, #FFD97B 100%)",
    activityColor: "linear-gradient(180deg, #FFD97B 0%, #D6AC42 100%)",
  },
  {
    value: "happy",
    icon: HappyIcon,
    name: "Happy",
    rating: 4,
    gradient: "linear-gradient(180deg, #FFFBEE 0%, #CBFF8D 100%)",
    activityColor: "linear-gradient(180deg, #CBFF8D 0%, #79B530 100%)",
  },
  {
    value: "neutral",
    icon: OkayIcon,
    name: "Neutral",
    rating: 3,
    gradient: "linear-gradient(180deg, #FFFBEE 0%, #EA8CFF 100%)",
    activityColor: "linear-gradient(180deg, #EA8CFF 0%, #B147C9 100%)",
  },
  {
    value: "sad",
    icon: SadIcon,
    name: "Sad",
    rating: 2,
    gradient: "linear-gradient(180deg, #FFFBEE 0%, #8CD7FF 100%)",
    activityColor: "linear-gradient(180deg, #8CD7FF 0%, #6262FF 100%)",
  },
  {
    value: "angry",
    icon: AngryIcon,
    name: "Angry",
    rating: 1,
    gradient: "linear-gradient(180deg, #FFFBEE 0%, #FF8C8C 100%)",
    activityColor: "linear-gradient(180deg, #FF8C8C 0%, #DF4848 100%)",
  },
];

const ACTIVITY_OPTIONS = [
  "Exercise",
  "Entertainment",
  "Outdoors",
  "Relaxation",
  "Family",
  "Hobbies",
  "Reading",
  "Friends",
  "Work",
];

export default function MoodModal({ onSubmit, onClose }) {
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split("T")[0],
    mood_category: "",
    mood_rating: 0,
    activities: [],
    notes: "",
  });

  const [selectedMood, setSelectedMood] = useState(null);
  const [errors, setErrors] = useState({});

  const handleMoodSelect = (mood) => {
    setFormData({
      ...formData,
      mood_category: mood.value,
      mood_rating: mood.rating,
    });
    setSelectedMood(mood);
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
    <div className="mood__modal_overlay" onClick={onClose}>
      <div
        className="mood__modal"
        onClick={(e) => e.stopPropagation()}
        style={{
          background: selectedMood ? selectedMood.gradient : "#FFFBEE",
        }}
      >
        <button className="mood__modal_close-button" onClick={onClose}>
          ✕
        </button>

        <div className="mood__modal_body">
          <form onSubmit={handleSubmit} className="mood__form">
            <div className="mood__form_group">
              <h2 className="mood__form_title">How are you feeling today?</h2>
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
                    <img
                      src={mood.icon}
                      alt={mood.name}
                      className="mood__form_mood-emoji"
                    />
                  </button>
                ))}
              </div>
              {errors.mood && (
                <span className="mood__form_error">{errors.mood}</span>
              )}
            </div>

            <div className="mood__form_group">
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
                    style={{
                      background:
                        formData.activities.includes(activity) && selectedMood
                          ? selectedMood.activityColor
                          : "linear-gradient(180deg, #fbf4de 0%, #e4dbbf 100%)",
                    }}
                  >
                    {activity}
                  </button>
                ))}
              </div>
            </div>

            <div className="mood__form_group">
              <textarea
                className="mood__form_textarea"
                value={formData.notes}
                onChange={(e) =>
                  setFormData({ ...formData, notes: e.target.value })
                }
                placeholder="Notes..."
                rows="4"
              />
            </div>

            <button type="submit" className="mood__form_submit-button">
              Add Mood
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
