import styles from "./SearchInput.module.css";
import search from "../../assets/icons/search.svg";
import close from "../../assets/icons/close.svg";

export default function SearchInput({ value, onChange, onEnter }) {
  return (
    <div className={styles.inputWrapper}>
      <input
        type="text"
        className={styles.input}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            onEnter();
          }
        }}
        placeholder="Search by location, services, fuel"
      />
      {value ? (
        <img
          src={close}
          alt="clear"
          className={styles.closeIcon}
          onClick={() => onChange("")}
        />
      ) : (
        <img src={search} alt="search" className={styles.searchIcon} />
      )}
    </div>
  );
}
