// fetch stations from the backend API

export async function fetchStations(apiUrl, options = {}) {
  const { bounds, ...fetchOptions } = options;

  // Build URL with viewport bounds if provided
  let url = apiUrl;
  if (bounds) {
    const params = new URLSearchParams({
      north: bounds.north.toString(),
      south: bounds.south.toString(),
      east: bounds.east.toString(),
      west: bounds.west.toString(),
    });
    url = `${apiUrl}?${params.toString()}`;
  }

  const response = await fetch(url, {
    // Performance optimizations
    method: "GET",
    headers: {
      Accept: "application/json",
      "Cache-Control": "max-age=300", // Cache for 5 minutes
    },
    ...fetchOptions, // Spread additional fetch options
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return response.json();
}

// Client-side filtering function as fallback
export function filterStationsByBounds(stations, bounds) {
  if (!bounds || !stations) return stations;

  return stations.filter((station) => {
    const lng = station.location.longitude;
    const lat = station.location.latitude;

    return (
      lng >= bounds.west &&
      lng <= bounds.east &&
      lat >= bounds.south &&
      lat <= bounds.north
    );
  });
}
