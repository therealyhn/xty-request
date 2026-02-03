/**
 * API Client for XTY Requests
 * Handles communication with the local PHP backend
 */

const API_BASE = '/api';

/**
 * @typedef {Object} DeezerTrack
 * @property {number} id
 * @property {string} title
 * @property {string} link
 * @property {string} preview
 * @property {Object} artist
 * @property {string} artist.name
 * @property {Object} album
 * @property {string} album.title
 * @property {string} album.cover_medium
 */

/**
 * Search Deezer tracks via backend proxy
 * @param {string} query 
 * @returns {Promise<DeezerTrack[]>}
 */
export async function searchTracks(query) {
    if (!query || query.trim().length < 2) return [];

    // Use URLSearchParams for safe encoding
    const params = new URLSearchParams({ q: query });

    try {
        const response = await fetch(`${API_BASE}/search.php?${params}`);

        if (!response.ok) {
            throw new Error(`Search failed: ${response.statusText}`);
        }

        const data = await response.json();

        // Deezer API returns { data: [...] }
        return data.data || [];
    } catch (error) {
        console.error('API Error:', error);
        return []; // Return empty array on error to prevent UI crash
    }
}

/**
 * Check backend health
 * @returns {Promise<boolean>}
 */
export async function checkBackendHealth() {
    try {
        const response = await fetch(`${API_BASE}/health.php`);
        return response.ok;
    } catch {
        return false;
    }
}
