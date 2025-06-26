import React from 'react'
import styles from './ResultsMenu.module.css'
import FilterMenu from './FilterMenu'
import { useState, useMemo } from 'react'
import StationCard from './StationCard'

export default function ResultsMenu({
    results,
    searchText,
    isLoading,
    error,
    selectedFilters,
    setSelectedFilters,
    onStationCardClick,
    selectedStationId, //single station selected
    handleShowAllResults //clear single station view
}) {
//   'results' is already filtered results passed down from App.jsx


    const [isFilterMenuOpen, setIsFilterMenuOpen] = useState (false)
    
    //determine if single station view or not
    const isSingleStationView = !!selectedStationId

    // useMemo determines which cards to display in the component.
    const displayedCards = useMemo(() => {
        if (isSingleStationView) {
            // If a single station is selected, find and return only that one.
            // Using the unique ID (_id or uuid) for comparison.
            return results.filter(station => (station._id || station.uuid) === selectedStationId);
        }
        // Otherwise, display all results passed from App.jsx (which are already filtered by category)
        return results;
    }, [results, selectedStationId, isSingleStationView]); // Dependencies for this useMemo

    // To conditionally render filter menu
    const toggleFilterMenu = () => {
        setIsFilterMenuOpen(!isFilterMenuOpen)
    };

    // to close filter menu (i.e. for cancel button see figma)
    const closeFilterMenu = () => {
        setIsFilterMenuOpen(false);
    };

    // Passes the filters directly up to App.jsx's setSelectedFilters
    const handleApplyFilters = (filters) => {
        setSelectedFilters(filters); // This calls the setSelectedFilters from App.jsx
    };

    // Calculate total results based on what's 'currently' being displayed in cards
    // initially did it on results but had to update (see below)
    const resultsTotal = displayedCards ? displayedCards.length : 0;
    // const resultsTotal = results ? results.length : 0;

    // --- Conditional Rendering for Loading, Error, No Results ---
    if (isLoading) {
        return (
        <main className={styles.menuBox}>
            <div className={styles.loadingMessage}>
            <p>Loading stations for "{searchText}"...</p>
            </div>
        </main>
        );
    }

    if (error) {
        return (
        <main className={styles.menuBox}>
            <div className={styles.errorMessage}>
            <p>Error: {error}</p>
            <p>Please try your search again.</p>
            </div>
        </main>
        );
    }

    // --- Main Render when not loading or error ---
    return (
    <main className={styles.menuBox}>

        {/* "Show All Results" button appears when in single station view */}
        {isSingleStationView && (
            <button className={styles.showAllResultsButton} onClick={handleShowAllResults}>
                Back to all Results
            </button>
        )}

        {/* Hide filter and sort buttons, and the close button, if in single station view */}
        {!isSingleStationView && (
            <div className={styles.buttonsBox}>
                <div className={styles.filterAndArrowsBox}>
                    <button
                        className={styles.filterButton}
                        onClick={toggleFilterMenu}
                    />
                    <button className={styles.arrowsButton} />
                </div>
                {/* Assuming this closeButton closes the whole ResultsMenu */}
                <button className={styles.closeButton} />
            </div>
        )}

        {/* Hide results count if in single station view */}
        {!isSingleStationView && (
            <div className={styles.numberOfResults}>
                {resultsTotal > 0 ? (
                    <>Showing {resultsTotal} results with "{searchText}"</>
                ) : (
                    searchText ? (
                        <>No Results found for "{searchText}"</>
                    ) : (
                        <>Start search above to find stations.</>
                    )
                )}
            </div>
        )}

        

        

        {isFilterMenuOpen ? (
           <FilterMenu 
                onClose={closeFilterMenu} 
                // Pass 'currently displayed' results for options generation (or SearchResults from App if you want all possible options)
                results={results}
                    //Pass the handler from ResultsMenu (which calls App's setter)
                onApplyFilters={handleApplyFilters}
                // Pass the currently *applied* filters from App.jsx down to FilterMenu for its initial state
                currentSelectedServices={selectedFilters.services}
                currentSelectedStationTypes={selectedFilters.stationTypes}
                currentSelectedFuelTypes={selectedFilters.fuelTypes}
            />
        ): (
                // The mapping logic now lives here in ResultsMenu
                <div className={styles.stationCardsListContainer}> 
                    {/* Optional: Add a container for the list of cards */}
                    
                    {resultsTotal > 0 ? ( // Only map if there are results
                        displayedCards.map((station) => (
                        // Pass each individual station object to StationCard
                        // Use _id or uuid from your schema for a more stable key if available
                        <StationCard 
                            key={station._id || station.uuid || station.name + Math.random()} 
                            station={station} 
                            onCardClick={onStationCardClick} //handler for individual card click
                            // Could pass a prop to StationCard to style differently when its the 'selected card' as per brief?
                                // isSelectedCard={isSingleStationView && (station._id || station.uuid) === selectedStationId}
                        />
                        ))
                    ) : (
                        // This message for 0 results AFTER a search,
                        // not for the initial "Start your search" (above).
                        // still needed due to conditional render?
                    null
                    )}
                </div>
        )}
    


    </main>
  )
}



