import React from 'react'
import styles from './ResultsMenu.module.css'
import FilterMenu from './FilterMenu'
import { useState } from 'react'

export default function ResultsMenu({resultsTotal, searchPhrase}) {
  
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
            Showing {resultsTotal} results with "{searchPhrase}"
        </div>

        {isFilterMenuOpen && (
           <FilterMenu 

            />
 
        )};
        
        




    </main>
  )
}



