import React, { useState, useEffect, useRef } from 'react';
import styles from './FilterDropdown.module.css'; 
import DownArrowIcon from '../../../assets/icons/chevron_light.svg'; 
import CloseIcon from '../../../assets/icons/close.svg';

export default function FilterDropdown({
  placeholderText, // Default text when no items are selected
  options,         // The array of all selectable items (e.g., station types)
  selectedItems,   // The array of currently selected items (managed by parent)
  onItemSelect,    // Callback function when an item is clicked in the dropdown
  onItemRemove,    // Callback function when an item's close button is clicked
  title            // for the heading above the dropdown (e.g., "Station Type")
}) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Toggle dropdown visibility
  const toggleDropdown = () => {
    setIsDropdownOpen(prev => !prev);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []); 

  return (
    <div className={styles.filterDropdownContainer}>
      {title && <div className={styles.dropdownTitle}>{title}</div>} {/* Optional Title */}
      <div
        className={styles.customDropdown}
        ref={dropdownRef} 
      >
        

        <div className={styles.dropdownDisplay} onClick={toggleDropdown}>
          {/* img moved to a background image in CSS */}
          {/* <img
            src={DownArrowIcon}
            alt="Toggle Dropdown"
            className={`${styles.dropdownArrow} ${isDropdownOpen ? styles.arrowUp : ''}`}
          /> */}

          
          {selectedItems && selectedItems.length > 0 ? (
            <div className={styles.selectedTagsContainer}>
              {selectedItems.map((item) => (
                <span key={item} className={styles.selectedTag}>
                  {item}
                  <button
                    onClick={(e) => {
                      e.stopPropagation(); // Prevents toggling dropdown when clicking the close button
                      onItemRemove(item);
                    }}
                    className={styles.tagCloseButton}
                  >
                    <img
                      src={CloseIcon}
                      alt={`Remove ${item}`}
                      className={styles.tagCloseIcon}
                      style={{ filter: 'invert(1)', width: '10px', height: '10px' }}
                    />
                  </button>
                </span>
              ))}
            </div>
          ) : (
            <span className={styles.defaultText}>{placeholderText}</span>
          )}
          
        </div>

        {isDropdownOpen && (
          <ul className={styles.dropdownMenu}>
            {options && options.map(option => (
              <li
                key={option}
                className={`${styles.dropdownItem} ${selectedItems.includes(option) ? styles.selectedItem : ''}`}
                onClick={() => onItemSelect(option)}
              >
                {option}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}