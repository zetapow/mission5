import styles from "./TopHeader.module.css";
import Z_Energy from "../../../../assets/Z_Energy_logo.png";
import search from "../../../../assets/icons/search.svg";
import chevron_light from "../../../../assets/icons/chevron_light.svg";
import menu from "../../../../assets/icons/menu.svg";
import { useState } from "react";

function TopHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  function toggleMenu() {
    setIsMenuOpen((prev) => !prev);
  }

  return (
    <div className={styles.container}>
      <div className={styles.inside_container}>
        <div className={styles.left_side}>
          <img className={styles.logo} src={Z_Energy} alt="logo" />
          <button className={styles.button1}>For personal</button>
          <button className={styles.button2}>For business</button>
        </div>
        <div className={styles.right_side}>
          <p className={styles.right_button}>Z App</p>
          <p className={styles.right_button}>About Z</p>
          <img className={styles.search_icon} src={search} alt="search-icon" />
          <button className={styles.login}>
            Login
            <div className={styles.circle}>
              <img src={chevron_light} alt="chevron" />
            </div>
          </button>
          <img
            className={styles.menu}
            onClick={toggleMenu}
            src={menu}
            alt="menu"
          />
        </div>
      </div>
      {isMenuOpen && (
        <div className={styles.dropdown_content}>
          <p className={styles.dropdown_item}>For personal</p>
          <p className={styles.dropdown_item}>For business</p>
          <p className={styles.dropdown_item}>Z App</p>
          <p className={styles.dropdown_item}>About Z</p>
          <p className={styles.dropdown_item}>Login</p>
        </div>
      )}
    </div>
  );
}

export default TopHeader;
