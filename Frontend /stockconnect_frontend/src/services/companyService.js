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
  },

  /**
   * Create a new company
   */
  async createCompany(companyData) {
    try {
      const response = await apiFetch(`${API_BASE_URL}/admin/companies`, {
        method: 'POST',
        body: JSON.stringify(companyData),
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.message || 'Failed to create company');
      }

      return await response.json();
    } catch (error) {
      console.error('Error creating company:', error);
      throw error;
    }
  },

  /**
   * Update company price
   */
  async updateCompanyPrice(id, newPrice) {
    try {
      const response = await apiFetch(`${API_BASE_URL}/admin/companies/${id}/price?newPrice=${newPrice}`, {
        method: 'PUT',
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.message || 'Failed to update company price');
      }

      return await response.json();
    } catch (error) {
      console.error('Error updating company price:', error);
      throw error;
    }
  }
};
