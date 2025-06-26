import React from 'react'
import styles from './StationCard.module.css'

export default function StationCard({results}) {
   if (!results || results.length === 0) {
        return (
            <div className={styles.noResultsMessage}>
                <p>No stations found.</p>
                
            </div>
        );
    }

    return (
        <div className={styles.displaySearchResultsContainer}> 
            {results.map((station) => (
                <div key={station.id} className={styles.stationResultItem}>
                    
                    <h3>{station.name || 'Station Name'}</h3>
                    <p>{station.address || 'Address not available'}</p>
                    
                </div>
            ))}
        </div>
    );
}
