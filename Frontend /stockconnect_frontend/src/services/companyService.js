import { apiFetch } from './apiClient';

// Base URL configuration - assuming backend is running on 8080
const API_BASE_URL = 'http://localhost:8080/api';

export const companyService = {
  /**
   * Fetch all companies from the database
   * @returns {Promise<Array>} Array of company objects
   */
  async getAllCompanies() {
    try {
      const response = await apiFetch(`${API_BASE_URL}/companies`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch companies');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error fetching companies:', error);
      throw error;
    }
  }
};
