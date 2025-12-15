import "./profile.css";
import Avatar from "../../assets/Avatar.jpg";


  // You can later make these dynamic from user data


export default function Profile({ openModal }) {
  // Hardcoded for now - will eventually pull this from user context or props
    const userName = "Eve Smith";
  const userAvatar = Avatar;
  const currentUser = {
    name: userName,
    profilePicture: userAvatar,}
    // Could add more user info here later like mood streak, join date, etc.


  const handleLogMoodButtonClick = () => {
    openModal("mood");
  };

  const handleStatsButtonClick = () => {
    openModal("stats");
  };
  const handleEditProfileClick = () => {
    openModal("editProfile");
  }

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
          onClick={handleEditProfileClick}
        ></button>
          {/* Note: This button seems empty - might want to add an edit icon here */}


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

