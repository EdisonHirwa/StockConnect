import { apiFetch } from './apiClient';

export const superAdminService = {
  getDashboardData: async () => {
    try {
      const response = await apiFetch('http://localhost:8080/api/superadmin/dashboard');
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching superadmin dashboard data:', error);
      throw error;
    }
  },

  getAuditLogs: async () => {
    try {
      const response = await apiFetch('http://localhost:8080/api/superadmin/audit-logs');
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching audit logs:', error);
      throw error;
    }
  },

  getAllUsers: async () => {
    try {
      const response = await apiFetch('http://localhost:8080/api/superadmin/users');
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching users:', error);
      throw error;
    }
  },

  deleteUser: async (id) => {
    try {
      const response = await apiFetch(`http://localhost:8080/api/superadmin/users/${id}`, {
        method: 'DELETE'
      });
      if (!response.ok) {
        throw new Error('Failed to delete user. They may have active dependencies.');
      }
      return true;
    } catch (error) {
      console.error('Error deleting user:', error);
      throw error;
    }
  },

  updateUserRole: async (id, newRole) => {
    try {
      const response = await apiFetch(`http://localhost:8080/api/superadmin/users/${id}/role`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role: newRole })
      });
      if (!response.ok) {
        throw new Error('Failed to update role.');
      }
      return true;
    } catch (error) {
      console.error('Error updating user role:', error);
      throw error;
    }
  },

  getSettings: async () => {
    try {
      const response = await apiFetch('http://localhost:8080/api/superadmin/settings');
      if (!response.ok) throw new Error('Failed to fetch settings.');
      return await response.json();
    } catch (error) {
      console.error('Error fetching settings:', error);
      throw error;
    }
  },

  updateSettings: async (settings) => {
    try {
      const response = await apiFetch('http://localhost:8080/api/superadmin/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings)
      });
      if (!response.ok) throw new Error('Failed to save settings.');
      return await response.json();
    } catch (error) {
      console.error('Error saving settings:', error);
      throw error;
    }
  },
};

