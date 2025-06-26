import React from 'react';
import styles from './StationCard.module.css'

export default function StationCard({ station, onCardClick }) {
    //onCardClick prop for single card on click by user

    const { name, location, services, opening_hours } = station;

    // display all services as a comma-separated list for now NEED TO ADD DROPDOWN LATER AS PER BRIEF
    const serviceNames = services && services.length > 0
        ? services.map(service => service.name).join(', ')
        : 'No services listed';

    // handler for station name click (currently h3 element)
    const handleStationNameClick = () => {
        // Using _id or uuid which should have been passed down. Prioritize _id if available.
        const stationId = station._id || station.uuid;
        
        // debugging console logs for station name click not working
        console.log("StationCard: Station Name Clicked!");
        console.log("Station Name:", name);
        console.log("Station ID (for click):", stationId);
        console.log("onCardClick prop received:", !!onCardClick); // Check if prop exists and is truthy
        
        
        if (stationId && onCardClick) {
            onCardClick(stationId);
        }
    };
    
    return (
        <div key={station._id || station.uuid || station.name} className={styles.stationResultItem} >
            {/* Station Name */}
            <h3 className={styles.stationName} onClick={handleStationNameClick}>
                {name || 'Station Name'}
            </h3>

            {/* Location City */}
            {location && location.city && (
                <p className={styles.stationLocation}>
                    {location.city}
                </p>
            )}

            {/* Opening Hours: Now listing all days */}
            <div className={styles.stationHours}>
                <h4>Opening Hours:</h4>
                {opening_hours && opening_hours.length > 0 ? (
                    opening_hours.map((oh, index) => (
                        <p key={index} className={styles.hourItem}>
                            <strong>{oh.day}:</strong> {oh.hours}
                        </p>
                    ))
                ) : (
                    <p className={styles.hourItem}>Hours not available.</p>
                )}
            </div>

            {/* Services */}
            <div className={styles.stationServices}>
                <h4>Services:</h4>
                <p>{serviceNames}</p>
            </div>

        </div>
    );
}