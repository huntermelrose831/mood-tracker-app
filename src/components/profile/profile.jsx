import "./profile.css";

export default function Profile({ onLogMoodClick, onStatsClick }) {
  // You can later make these dynamic from user data
  const userName = "Eve Smith";
  const userAvatar =
    "https://testingbot.com/free-online-tools/random-avatar/200?img=1";

  const handleEditProfile = () => {
    console.log("Edit profile clicked");
    // TODO: Open edit profile modal
  };

  return (
    <div className="profile">
      <div className="profile__left">
        <img src={userAvatar} alt={userName} className="profile__avatar" />
        <h2 className="profile__name">{userName}</h2>
        <button className="profile__edit-button" onClick={handleEditProfile}>
          Edit Profile
        </button>
      </div>

      <div className="profile__right">
        <button
          className="profile__button profile__button--primary"
          onClick={onLogMoodClick}
        >
          + Log Mood
        </button>
        <button className="profile__button" onClick={onStatsClick}>
          Stats
        </button>
      </div>
    </div>
  );
}
