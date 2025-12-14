import React from "react";
import "./addMood.css";

export default function AddMood({ onSubmit, onClose }) {
  return (
    <form>
      <h2>Add Mood Entry</h2>
      {/* Form fields for adding a mood entry would go here */}
      <button onClick={onClose}>Close</button>
    </form>
  );
}