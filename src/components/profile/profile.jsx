import "./profile.css";
import Snowflake from "../../assets/snowflake.svg";

export default function Profile({
  profile,
  onLogMoodClick,
  onStatsClick,
  onEditProfileClick,
}) {
  // snowflake icons are hover-only; no click state required

  const openEditProfileModal = () => {
    if (onEditProfileClick) onEditProfileClick();
  };

  const handleLogMoodButtonClick = () => {
    if (onLogMoodClick) onLogMoodClick();
  };

  const handleStatsButtonClick = () => {
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

      <div className="profile__right">
        <button className="profile__button" onClick={handleLogMoodButtonClick}>
          <img src={Snowflake} alt="" className="profile__button-icon" />
          Add Mood
          <img src={Snowflake} alt="" className="profile__button-icon" />
        </button>

        <button className="profile__button" onClick={handleStatsButtonClick}>
          <img src={Snowflake} alt="" className="profile__button-icon" />
          Stats
          <img src={Snowflake} alt="" className="profile__button-icon" />
        </button>
      </div>
    </div>
  );
}
