import React from 'react';
import styles from './StationCard.module.css'
import { useState, useEffect } from 'react';
import DownArrowIcon from '../../../assets/icons/chevron_light.svg'
import directionsIcon from '../../../assets/icons/open_new_tab.svg'

export default function StationCard({ station, onCardClick }) {
    //onCardClick prop for single card on click by user

    const { _id, uuid, name, location, services, opening_hours } = station;

    //useStates for hours/services dropdowns
    const [isOpenHoursOpen, setIsOpenHoursOpen] = useState(false);
    const [isServicesOpen, setIsServicesOpen] = useState(false);

    // Functions to toggle hours/services dropdowns
    const toggleOpenHours = () => {
        setIsOpenHoursOpen(!isOpenHoursOpen);
    };

    const toggleServices = () => {
        setIsServicesOpen(!isServicesOpen);
    };
    
    
    
    // display all services as a comma-separated list for now NEED TO ADD DROPDOWN LATER AS PER BRIEF
    // const serviceNames = services && services.length > 0
    //     ? services.map(service => service.name).join(', ')
    //     : 'No services listed';

    // handler for station name click (currently h3 element)
    const handleStationNameClick = () => {
        // Using _id or uuid which should have been passed down. 
        const stationId = station._id || station.uuid;
        
        // debugging console logs for station name click not working
        console.log("StationCard: Station Name Clicked!");
        console.log("Station Name:", name);
        console.log("Station ID (for click):", stationId);
        console.log("onCardClick prop received:", !!onCardClick); 
        
        
        if (stationId && onCardClick) {
            onCardClick(stationId);
        }
    };
    
        console.log("'station' in StationCard:", station._id);

    
    // get directions fetch request, use address response for GoogleMaps search (3 stage process)
    const getDirections = async() => {
       const stationIdToFetch = _id || uuid;
       
       if (!stationIdToFetch) {
      console.error("Error: Station ID (_id or uuid) not found for directions.");
      return;
        }
        try 
        {
            // 1. Send fetch request to backend using StationId from users search results
            
            const response = await fetch(`http://localhost:4000/api/get-directions?stationId=${encodeURIComponent(stationIdToFetch)}`);

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
            }

            const data = await response.json(); // Should be object like { address: "..." } as per schema / database documents
            const fetchedAddress = data.address; // Extract the address from the response

            if (!fetchedAddress) {
                console.error("Error: No address returned from the backend for directions.");
                return;
            }

            // 2. Turn the results into a string and add the prefix "z station" this way should steer GoogleMaps to Nearest Z station is address not exactly correct
            // initially used co-ordinates but this did not show user that coordinates were a Z station, or any info on the station
            const searchString = `Z Station ${fetchedAddress}`;
            console.log("Searching Google Maps for:", searchString);

            // 3. Opens a new tab to Google Maps and triggers a search
            const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(searchString)}`;
            window.open(googleMapsUrl, '_blank'); 

        } 
        
        catch (err) 
        {
            console.error("Failed to get directions or open map:", err);
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

            {/* Opening Hours Section - Dropdown */}
            <div className={styles.dropdownContainer}> 
                <div className={styles.dropdownHeaderHours} onClick={toggleOpenHours}>
                    <h4 className={styles.dropdownTitleHours}>Opening Hours:</h4>
                    <button
                        className={`${styles.dropdownToggleHours} ${isOpenHoursOpen ? styles.open : ''}`}
                        aria-expanded={isOpenHoursOpen}
                        aria-label="Toggle Opening Hours visibility"
                    />
                </div>
                {isOpenHoursOpen && (
                    <div className={styles.dropdownContent}>
                        {opening_hours && opening_hours.length > 0 ? (
                            opening_hours.map((oh, index) => (
                                <p key={index} className={styles.hourItem}>
                                    <strong>{oh.day.slice(0,3)}:</strong>{oh.hours}
                                </p>
                            ))
                        ) : (
                            <p className={styles.hourItem}>Hours not available.</p>
                        )}
                    </div>
                )}
            </div>

            {/* Services Section - Dropdown */}
            <div className={styles.dropdownContainer}> 
                <div className={styles.dropdownHeaderServices} onClick={toggleServices}>
                    <h4 className={styles.dropdownTitleServices}>Services:</h4>
                    <button
                        className={`${styles.dropdownToggleServices} ${isServicesOpen ? styles.open : ''}`}
                        aria-expanded={isServicesOpen}
                        aria-label="Toggle Services visibility"
                    />
                </div>
                {isServicesOpen && (
                    <div className={styles.dropdownContent}>
                        {services && services.length > 0 ? (
                            <ul> 
                                {services.map((service, index) => (
                                    <li key={index} className={styles.serviceItem}>
                                        {service.name}
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p className={styles.serviceItem}>No services listed.</p>
                        )}
                    </div>
                )}
            </div>

            <div className={styles.getDirections}>
                <button className={styles.getDirectionsButton} onClick={getDirections}>
                    Get directions &nbsp;&nbsp;
                    <img className={styles.getDirectionsImg} src={directionsIcon} alt="directions icon" />
                </button>
            </div>

        </div>
    );
}