export async function geocode(query) {
  const response = await fetch(
    `/api/maptiler/geocode?query=${encodeURIComponent(query)}`
  );
  if (!response.ok) {
    throw new Error("Failed to fetch geocoding data.");
  }
  return response.json();
}

// export default geocode;
// This function fetches geocoding data from the backend API using the provided query.
