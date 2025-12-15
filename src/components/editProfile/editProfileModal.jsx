import React from "react";
import "../../ModalForm/ModalForm.css";
import Avatar from "../../assets/Avatar.jpg";

import "./editProfile.css";

import { useState } from "react";

function EditProfileModal({ onClose }) {
  const userAvatar = Avatar;
  const userName = "Eve Smith";
  const [currentUser] = useState({
    name: userName,
    profilePicture: userAvatar,
    bio: "",
  });

  return (
    <div className="modal__overlay">
      <div className="modal">
        <button className="modalCloseButton" onClick={onClose}>
          X
        </button>
        <h2 className="modal__title">Edit Profile</h2>
        <div className="editProfile__user">
          <img className="modal__avatar" src={userAvatar} alt="User Avatar" />
          <textarea className="modal__textarea" placeholder="Name">
            {currentUser.name}
          </textarea>
        </div>
        <button className="modal__btn">Save</button>
      </div>
    </div>
  );
}
export default EditProfileModal;
