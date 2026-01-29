// src/utils/apiBaseUrl.js
// Utility to get API base URL from environment

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// For image uploads (if needed)
export const UPLOADS_BASE_URL = `${API_BASE_URL}/uploads`;
