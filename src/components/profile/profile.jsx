import "./profile.css";
import Avatar from "../../assets/Avatar.jpg";

export default function Profile({
  onLogMoodClick,
  onStatsClick,
  onEditProfileClick,
}) {
  const currentUser = {
    name: "Eve Smith",
    profilePicture: Avatar,
  };

  const openEditProfileModal = () => {
    if (onEditProfileClick) {
      onEditProfileClick();
    }
  };

  const handleLogMoodButtonClick = () => {
    if (onLogMoodClick) {
      onLogMoodClick();
    }
  };

  const handleStatsButtonClick = () => {
    if (onStatsClick) {
      onStatsClick();
    }
  };

  return (
    <div className="profile">
      {/* Left side - user info and avatar */}
      <div className="profile__left">
        <img
          src={currentUser.profilePicture}
          alt={`${currentUser.name}'s avatar`}
          className="profile__avatar"
        />
        <h2 className="profile__name">{currentUser.name}</h2>

        <button
          className="profile__edit-button"
          onClick={openEditProfileModal}
          aria-label="Edit profile"
        ></button>
      </div>

      {/* Right side - action buttons */}
      <div className="profile__right">
        <button className="profile__button" onClick={handleLogMoodButtonClick}>
          + Log Mood
        </button>

        <button className="profile__button" onClick={handleStatsButtonClick}>
          Stats
        </button>
      </div>
    </div>
  );
}
