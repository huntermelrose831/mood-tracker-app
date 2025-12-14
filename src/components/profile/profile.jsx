import "./profile.css";
import Avatar from "../../assets/Avatar.jpg";

export default function Profile({ onLogMoodClick, onStatsClick }) {
  // Hardcoded for now - will eventually pull this from user context or props
  const currentUser = {
    name: "Eve Smith",
    profilePicture: Avatar,
    // Could add more user info here later like mood streak, join date, etc.
  };

  const openEditProfileModal = () => {
    console.log("Edit profile button was clicked");
    // TODO: Implement edit profile functionality
    // Maybe show a modal with name/avatar editing options?
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

        {/* Edit button - probably needs an icon or text */}
        <button
          className="profile__edit-button"
          onClick={openEditProfileModal}
          aria-label="Edit profile"
        >
          {/* Note: This button seems empty - might want to add an edit icon here */}
        </button>
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
