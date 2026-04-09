import { apiFetch } from './apiClient';

const API_BASE_URL = 'http://localhost:8080/api/admin';

export const marketAdminService = {
  /**
   * Fetch market stats (KPIs)
   */
  async getStats() {
    try {
      const response = await apiFetch(`${API_BASE_URL}/stats`);
      if (!response.ok) throw new Error('Failed to fetch market stats');
      return await response.json();
    } catch (error) {
      console.error('Error fetching market stats:', error);
      throw error;
    }
  },

  /**
   * Fetch all executed trades in the system
   */
  async getAllTrades() {
    try {
      const response = await apiFetch(`${API_BASE_URL}/trades`);
      if (!response.ok) throw new Error('Failed to fetch trades');
      return await response.json();
    } catch (error) {
      console.error('Error fetching trades:', error);
      throw error;
    }
  },

  /**
   * Fetch all orders in the system
   */
  async getAllOrders() {
    try {
      const response = await apiFetch(`${API_BASE_URL}/orders`);
      if (!response.ok) throw new Error('Failed to fetch orders');
      return await response.json();
    } catch (error) {
      console.error('Error fetching orders:', error);
      throw error;
    }
  }
};
