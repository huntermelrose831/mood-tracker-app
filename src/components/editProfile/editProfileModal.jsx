import React from "react";
import MoodDropdown from "../../MoodDropdown/MoodDropdown";
import "./editProfile.css";
import { useState } from "react";

function EditProfileModal({ onClose, onSubmit }) {
  const [user, setUser] = useState({
    name: "",
    avatar: "",
    bio: "",
  });

  return (
    <div className="modal__overlay">
      <div className="modal__content">
        <button className="modalCloseButton" onClick={onClose}>
          X
        </button>
        <h2 className="editProfile__header">Edit Profile</h2>
        <div className="editProfile__user">
          <div className="editProfile__avatar">{user.avatar}</div>
          <textarea className="editProfile__info" placeholder="Name">
            {user.name}
          </textarea>
        </div>
        <button className="edit-mood-btn">Save</button>
      </div>
    </div>
  );
}
export default EditProfileModal;
