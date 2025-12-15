import { useState, useEffect } from "react";
import { dataService } from "../../services/dataService.js";
import "./editProfile.css";
export default function EditProfileModal({ onClose, onSave }) {
  const [profileName, setProfileName] = useState("");
  const [avatarPreview, setAvatarPreview] = useState("");
  const [avatarFile, setAvatarFile] = useState(null);

  useEffect(() => {
    const profile = dataService.getProfile();
    setProfileName(profile.name);
    setAvatarPreview(profile.avatar);
  }, []);

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setAvatarFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    const updatedProfile = {
      name: profileName,
      avatar: avatarPreview,
    };

    if (onSave) onSave(updatedProfile);
    else {
      // Fallback if onSave wasn't provided
      dataService.saveProfile(updatedProfile);
      onClose();
      window.location.reload();
    }
  };

  return (
    <>
      <div className="edit__profile_overlay" onClick={onClose}></div>
      <div className="edit__profile_modal">
        <h2 className="edit__profile_title">Edit Profile</h2>

        <div className="edit__profile_content">
          <div className="edit__profile_avatar-section">
            <div className="edit__profile_avatar-container">
              <img
                src={avatarPreview}
                alt="Profile"
                className="edit__profile_avatar"
              />
              <input
                type="file"
                id="avatar-upload"
                className="edit__profile_file-input"
                accept="image/*"
                onChange={handleImageUpload}
              />
              <label
                htmlFor="avatar-upload"
                className="edit__profile_avatar-overlay"
              >
                Click to change
              </label>
            </div>
            <div className="edit__profile_input-section">
              <input
                type="text"
                className="edit__profile_name-input"
                placeholder="Profile Name"
                value={profileName}
                onChange={(e) => setProfileName(e.target.value)}
              />
            </div>
          </div>

          <button className="edit__profile_save-button" onClick={handleSave}>
            Save
          </button>
        </div>
      </div>
    </>
  );
}
