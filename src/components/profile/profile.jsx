import "./profile.css";

export default function Profile({
  onAvatarClick,
  onLogMoodClick,
  onStatsClick,
}) {
  return (
    <div className="profile__container">
      <div className="profile__edit-wrapper">
        <div className="profile__avatar" onClick={onAvatarClick}></div>
        <p className="profile__name">Profile Name</p>
        <button className="profile__edit-btn"></button>
      </div>
      <div class="profile__btns">
        <button className="profile__btn" onClick={onLogMoodClick}>
          + Log Mood
        </button>
        <button className="profile__btn" onClick={onStatsClick}>
          Stats
        </button>
      </div>
    </div>
  );
}
