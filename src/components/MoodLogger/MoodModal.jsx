import { useState } from "react";

import "../editProfile/editProfile.css";

import "./MoodModal.css";
import ExcitedIcon from "../../assets/Excited.png";
import HappyIcon from "../../assets/Happy.png";
import OkayIcon from "../../assets/Okay.png";
import SadIcon from "../../assets/Sad.png";
import AngryIcon from "../../assets/Angry.png";


// Mood configuration - could probably move this to a separate config file later
const MOOD_OPTIONS = [
  { value: "excited", label: "😄", name: "Excited", rating: 5 },
  { value: "happy", label: "😊", name: "Happy", rating: 4 },
  { value: "neutral", label: "😐", name: "Neutral", rating: 3 },
  { value: "sad", label: "../assets/Sad.jpg", name: "Sad", rating: 2 },
  { value: "angry", label: "😰", name: "Angry", rating: 1 },

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

// Available activity options - keeping it simple for now
const AVAILABLE_ACTIVITIES = [
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
  // Initialize form with today's date by default
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split("T")[0], // Gets YYYY-MM-DD format
    mood_category: "",
    mood_rating: 0,
    activities: [],
    notes: "",
  });

  const [currentSelectedMood, setCurrentSelectedMood] = useState(null);
  const [validationErrors, setValidationErrors] = useState({});

  // Handle mood selection and update form data accordingly
  const selectMood = (moodOption) => {
    setFormData((prevData) => ({
      ...prevData,
      mood_category: moodOption.value,
      mood_rating: moodOption.rating,
    }));

    setCurrentSelectedMood(moodOption);

    // Clear any existing mood validation errors
    if (validationErrors.mood) {
      setValidationErrors((prevErrors) => ({
        ...prevErrors,
        mood: "",
      }));
    }
  };

  // Toggle activity selection - add if not selected, remove if already selected
  const toggleActivity = (activityName) => {
    const currentActivities = formData.activities;
    let updatedActivities;

      
    setFormData({ ...formData, activities: newActivities });

    if (currentActivities.includes(activityName)) {
      // Remove activity if it's already selected
      updatedActivities = currentActivities.filter(
        (activity) => activity !== activityName
      );
    } else {
      // Add activity if it's not selected
      updatedActivities = [...currentActivities, activityName];
    }

    setFormData((prevData) => ({
      ...prevData,
      activities: updatedActivities,
    }));
};

  // Basic form validation - just checking required fields for now
  const validateForm = () => {
    const errors = {};

    if (!formData.mood_category) {
      errors.mood = "Please select a mood";
    }

    if (!formData.date) {
      errors.date = "Please select a date";
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0; // Returns true if no errors
  };

  const handleFormSubmit = (event) => {
    event.preventDefault();

    if (validateForm()) {
      onSubmit(formData);
    }
    // If validation fails, error messages will be displayed
  };

  const handleNotesChange = (event) => {
    const newNotes = event.target.value;
    setFormData((prevData) => ({
      ...prevData,
      notes: newNotes,
    }));
  };

  // Default background when no mood is selected
  const modalBackground = currentSelectedMood
    ? currentSelectedMood.gradient
    : "#FFFBEE";

  return (
    <div className="mood__modal_overlay" onClick={onClose}>
      <div
        className="mood__modal"
        onClick={(e) => e.stopPropagation()} // Prevent modal from closing when clicking inside
        style={{ background: modalBackground }}
      >
        {/* Close button in top right */}
        <button className="mood__modal_close-button" onClick={onClose}>
          ✕
        </button>

        <div className="mood__modal_body">
          <form onSubmit={handleFormSubmit} className="mood__form">
            {/* Mood selection section */}
            <div className="mood__form_group">
              <h2 className="mood__form_title">How are you feeling today?</h2>

              <div className="mood__form_mood-selector">
                {MOOD_OPTIONS.map((moodOption) => (
                  <button
                    key={moodOption.value}
                    type="button"
                    className={`mood__form_mood-option ${
                      formData.mood_category === moodOption.value
                        ? "mood__form_mood-option--selected"
                        : ""
                    }`}
                    onClick={() => selectMood(moodOption)}
                  >
                    <img
                      src={moodOption.icon}
                      alt={moodOption.name}
                      className="mood__form_mood-emoji"
                    />
                  </button>
                ))}
              </div>

              {validationErrors.mood && (
                <span className="mood__form_error">
                  {validationErrors.mood}
                </span>
              )}
            </div>

            {/* Activity selection section */}
            <div className="mood__form_group">
              <div className="mood__form_activity-selector">
                {AVAILABLE_ACTIVITIES.map((activity) => {
                  const isActivitySelected =
                    formData.activities.includes(activity);

                  // Determine button background color
                  let buttonBackground;
                  if (isActivitySelected && currentSelectedMood) {
                    buttonBackground = currentSelectedMood.activityColor;
                  } else {
                    buttonBackground =
                      "linear-gradient(180deg, #fbf4de 0%, #e4dbbf 100%)";
                  }

                  return (
                    <button
                      key={activity}
                      type="button"
                      className={`mood__form_activity-chip ${
                        isActivitySelected
                          ? "mood__form_activity-chip--selected"
                          : ""
                      }`}
                      onClick={() => toggleActivity(activity)}
                      style={{ background: buttonBackground }}
                    >
                      {activity}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Notes section */}
            <div className="mood__form_group">
              <textarea
                className="mood__form_textarea"
                value={formData.notes}
                onChange={handleNotesChange}
                placeholder="Notes..."
                rows="4"
              />
            </div>

            {/* Submit button */}
            <button type="submit" className="mood__form_submit-button">
              Add Mood
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
