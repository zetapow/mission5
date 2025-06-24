import styles from "./BottomHeader.module.css";
import chevron_light from "../../../../assets/icons/chevron_light.svg";

function BottomHeader() {
  return (
    <div className={styles.container}>
      <div className={styles.inside_container}>
        <p className={styles.links}>
          At the station <img src={chevron_light} alt="chevron" />
        </p>
        <p className={styles.links}>
          Power <img src={chevron_light} alt="chevron" />
        </p>
        <p className={styles.links}>
          Rewards and promotions <img src={chevron_light} alt="chevron" />
        </p>
        <p className={styles.links}>Locations</p>
      </div>
    </div>
  );
}

export default BottomHeader;
