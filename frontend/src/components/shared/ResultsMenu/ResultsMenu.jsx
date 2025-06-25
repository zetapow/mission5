import React, { use } from 'react'
import styles from './ResultsMenu.module.css'
import FilterMenu from './FilterMenu'
import { useState } from 'react'

export default function ResultsMenu() {
  
    const [isFilterMenuOpen, setIsFilterMenuOpen] = useState (false)
    
    // To conditionally render filter menu
    const toggleFilterMenu = () => {
        setIsFilterMenuOpen(!isFilterMenuOpen)
    };

    // to close filter menu (i.e. for cancel button see figma)
    const closeFilterMenu = () => {
        setIsFilterMenuOpen(false);
    };
  
    return (
    <main className={styles.menuBox}>
        <div className={styles.buttonsBox}>
            <div className={styles.filterAndArrowsBox}>
               <button 
                className={styles.filterButton}
                onClick={toggleFilterMenu}
               />

               <button className={styles.arrowsButton} /> 
            </div>
            <button className={styles.closeButton} />
        </div>

        <div className={styles.numberOfResults}>
            Showing X Results
        </div>

        {isFilterMenuOpen && (
           <FilterMenu 

            />
 
        )};
        
        




    </main>
  )
}



