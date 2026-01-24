/**
 * Centralized API Configuration
 *
 * This file manages all API endpoints for the application.
 * Uses Vite environment variables for production deployment.
 *
 * Environment Variable:
 * - VITE_API_URL: Base URL for the API (e.g., https://yourdomain.com/api)
 *
 * For development: defaults to localhost
 * For production: set VITE_API_URL in .env file
 */

// Base API URL - uses environment variable or defaults to localhost for development
export const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost/SiteBarosani/api';

// API Endpoints
export const API_ENDPOINTS = {
  // Public endpoints
  barosani: `${API_BASE}/barosani.php`,
  supremBarosan: `${API_BASE}/barosan_suprem.php`,
  applications: `${API_BASE}/applications.php`,
  uploadImage: `${API_BASE}/upload_image.php`,
  upgrade: `${API_BASE}/upgrade.php`,

  // SSE (Server-Sent Events)
  sseUpdates: `${API_BASE}/sse/updates.php`,

  // Auth
  auth: `${API_BASE}/auth.php`,

  // Admin endpoints
  admin: {
    statistics: `${API_BASE}/admin/statistics.php`,
    applications: `${API_BASE}/admin/applications.php`,
    barosani: `${API_BASE}/admin/barosani.php`,
    suprem: `${API_BASE}/admin/suprem.php`,
  }
};

// Shorthand exports for common endpoints
export const BAROSANI_URL = API_ENDPOINTS.barosani;
export const SUPREM_URL = API_ENDPOINTS.supremBarosan;
export const SSE_URL = API_ENDPOINTS.sseUpdates;
export const APPLICATIONS_URL = API_ENDPOINTS.applications;
export const UPLOAD_IMAGE_URL = API_ENDPOINTS.uploadImage;
export const UPGRADE_URL = API_ENDPOINTS.upgrade;
export const AUTH_URL = API_ENDPOINTS.auth;

export default API_ENDPOINTS;
