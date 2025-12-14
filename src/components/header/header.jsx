import "./header.css";
import Title from "../../assets/Logo2.png";
export default function Header() {
  return (
    <header className="header">
      <img src={Title} className="header__title" />
    </header>
  );
}
