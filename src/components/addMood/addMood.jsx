import React from "react";

export default function AddMood({closeModal }) {
  return (
    <>
      <h2>Add Mood Entry</h2>
      <button className="form__save-btn">Save</button>
      <button type="button" className="form__close-btn" onClick={closeModal}>Cancel</button>
    </>
  );
}