import { useState } from "react";
import "./profile.css";
import Snowflake from "../../assets/snowflake.svg";

export default function Profile({
  profile,
  onLogMoodClick,
  onStatsClick,
  onEditProfileClick,
}) {
  const [logMoodClicked, setLogMoodClicked] = useState(false);
  const [statsClicked, setStatsClicked] = useState(false);

  const openEditProfileModal = () => {
    if (onEditProfileClick) onEditProfileClick();
  };

  const handleLogMoodButtonClick = () => {
    setLogMoodClicked(true);
    if (onLogMoodClick) onLogMoodClick();
  };

  const handleStatsButtonClick = () => {
    setStatsClicked(true);
    if (onStatsClick) onStatsClick();
  };

  return (
    <div className="profile">
      <div className="profile__left">
        <img
          src={profile?.avatar}
          alt={`${profile?.name || "Profile"} avatar`}
          className="profile__avatar"
        />
        <h2 className="profile__name">{profile?.name}</h2>

        <button
          className="profile__edit-button"
          onClick={openEditProfileModal}
          aria-label="Edit profile"
        ></button>
      </div>

      {/* Right side - action buttons */}
      <div className="profile__right">
        <button className="profile__button" onClick={handleLogMoodButtonClick}>
          {logMoodClicked && (
            <img src={Snowflake} alt="" className="profile__button-icon" />
          )}
          Add Mood
          {logMoodClicked && (
            <img src={Snowflake} alt="" className="profile__button-icon" />
          )}
        </button>

        <button className="profile__button" onClick={handleStatsButtonClick}>
          {statsClicked && (
            <img src={Snowflake} alt="" className="profile__button-icon" />
          )}
          Stats
          {statsClicked && (
            <img src={Snowflake} alt="" className="profile__button-icon" />
          )}
        </button>
      </div>
    </div>
  );
}
