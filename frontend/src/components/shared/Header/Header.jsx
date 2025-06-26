import styles from "./Header.module.css";
import TopHeader from "./TopHeader/TopHeader";
import BottomHeader from "./BottomHeader/BottomHeader";

function Header() {
  return (
    <header>
      <TopHeader />
      <BottomHeader />
    </header>
  );
}

export default Header;
