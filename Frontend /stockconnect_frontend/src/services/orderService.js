import { apiFetch } from './apiClient';

const API_BASE_URL = 'http://localhost:8080/api/orders';

export const orderService = {
  /**
   * Get all user orders
   */
  async getUserOrders() {
    const response = await apiFetch(API_BASE_URL);
    if (!response.ok) throw new Error('Failed to fetch orders');
    return await response.json();
  },

  /**
   * Place a buy order
   * @param {Object} orderData - { companyId: UUID, quantity: Number, targetPrice: Number, type: string ('MARKET' | 'LIMIT') }
   */
  async placeBuyOrder(orderData) {
    try {
      const response = await apiFetch(`${API_BASE_URL}/buy`, {
        method: 'POST',
        body: JSON.stringify(orderData),
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.message || 'Failed to place buy order');
      }

      return await response.json();
    } catch (error) {
      console.error('Error placing buy order:', error);
      throw error;
    }
  },

  /**
   * Place a sell order
   * @param {Object} orderData - { companyId: UUID, quantity: Number, targetPrice: Number, type: string ('MARKET' | 'LIMIT') }
   */
  async placeSellOrder(orderData) {
    try {
      const response = await apiFetch(`${API_BASE_URL}/sell`, {
        method: 'POST',
        body: JSON.stringify(orderData),
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.message || 'Failed to place sell order');
      }

      return await response.json();
    } catch (error) {
      console.error('Error placing sell order:', error);
      throw error;
    }
  },

  /**
   * Cancel an order
   * @param {UUID} orderId
   */
  async cancelOrder(orderId) {
    try {
      const response = await apiFetch(`${API_BASE_URL}/${orderId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.message || 'Failed to cancel order');
      }
    } catch (error) {
      console.error('Error canceling order:', error);
      throw error;
    }
  }
};
