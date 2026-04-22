import { apiFetch } from './apiClient';

const API_BASE_URL = `${import.meta.env.VITE_API_BASE_URL}/admin`;

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
  },

  /**
   * Fetch leaderboard data
   */
  async getLeaderboard() {
    try {
      const response = await apiFetch(`${API_BASE_URL}/leaderboard`);
      if (!response.ok) throw new Error('Failed to fetch leaderboard');
      return await response.json();
    } catch (error) {
      console.error('Error fetching leaderboard:', error);
      throw error;
    }
  },

  /**
   * Fetch market analytics
   */
  async getAnalytics() {
    try {
      const response = await apiFetch(`${API_BASE_URL}/analytics`);
      if (!response.ok) throw new Error('Failed to fetch analytics');
      return await response.json();
    } catch (error) {
      console.error('Error fetching analytics:', error);
      throw error;
    }
  },

  /**
   * Fetch current market session info
   */
  async getSession() {
    try {
      const response = await apiFetch(`${API_BASE_URL}/session`);
      if (!response.ok) throw new Error('Failed to fetch session info');
      return await response.json();
    } catch (error) {
      console.error('Error fetching session:', error);
      throw error;
    }
  },

  /**
   * Toggle market session status
   */
  async toggleSession() {
    try {
      const response = await apiFetch(`${API_BASE_URL}/session/toggle`, { method: 'PATCH' });
      if (!response.ok) throw new Error('Failed to toggle session');
      return await response.json();
    } catch (error) {
      console.error('Error toggling session:', error);
      throw error;
    }
  },

  /**
   * Update session schedule
   */
  async updateSchedule(scheduleData) {
    try {
      const response = await apiFetch(`${API_BASE_URL}/session/schedule`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(scheduleData)
      });
      if (!response.ok) throw new Error('Failed to update schedule');
      return await response.json();
    } catch (error) {
      console.error('Error updating schedule:', error);
      throw error;
    }
  },

  /**
   * Broadcast market scenario event
   */
  async broadcastEvent(eventData) {
    try {
      const response = await apiFetch(`${API_BASE_URL}/session/broadcast`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(eventData)
      });
      if (!response.ok) throw new Error('Failed to broadcast event');
      return await response.json();
    } catch (error) {
      console.error('Error broadcasting event:', error);
      throw error;
    }
  }
};
