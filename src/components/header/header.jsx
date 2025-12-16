import "./header.css";
import Title from "../../assets/Logo.png";
import { useState, useEffect } from "react";

export default function Header() {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timerId = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => {
      clearInterval(timerId);
    };
  }, []);

  return (
    <header className="header">
      <img src={Title} className="header__title" />
      <div className="header__container">
        <p className="header__date-time">
          {currentTime.toLocaleDateString("en-US", {
            month: "long",
          })}
        </p>
        <p className="header__date-time">{currentTime.getFullYear()}</p>
      </div>
    </header>
  );
}
