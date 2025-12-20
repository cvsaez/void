// API Configuration
// Detecta automáticamente si está en desarrollo o producción
const API_BASE_URL = (() => {
  const hostname = window.location.hostname;
  
  // Si estás en localhost, usa el servidor local
  if (hostname === 'localhost' || hostname === '127.0.0.1') {
    return 'http://localhost:3000/api';
  }
  
  // Si estás en producción (GitHub Pages u otro), usa el servidor de Render
  return 'https://void-backend-ub5t.onrender.com/api';
})();

console.log('API URL:', API_BASE_URL);

// API Client
const api = {
  async getInventory() {
    try {
      const response = await fetch(`${API_BASE_URL}/inventory`);
      if (!response.ok) throw new Error('Failed to fetch inventory');
      return await response.json();
    } catch (error) {
      console.error('Error fetching inventory:', error);
      return null;
    }
  },

  async getProduct(productId) {
    try {
      const response = await fetch(`${API_BASE_URL}/inventory/${productId}`);
      if (!response.ok) throw new Error('Failed to fetch product');
      return await response.json();
    } catch (error) {
      console.error('Error fetching product:', error);
      return null;
    }
  },

  async checkAvailability(productId) {
    try {
      const response = await fetch(`${API_BASE_URL}/inventory/${productId}/available`);
      if (!response.ok) throw new Error('Failed to check availability');
      return await response.json();
    } catch (error) {
      console.error('Error checking availability:', error);
      return { available: false, soldOut: true };
    }
  },

  async purchaseProduct(productId) {
    try {
      const response = await fetch(`${API_BASE_URL}/inventory/${productId}/purchase`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error purchasing product:', error);
      return { success: false, error: error.message };
    }
  },

  async resetInventory() {
    try {
      const response = await fetch(`${API_BASE_URL}/inventory/reset`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
      return await response.json();
    } catch (error) {
      console.error('Error resetting inventory:', error);
      return { success: false, error: error.message };
    }
  },

  async updateProductQuantity(productId, quantity) {
    try {
      const response = await fetch(`${API_BASE_URL}/inventory/${productId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ quantity })
      });
      return await response.json();
    } catch (error) {
      console.error('Error updating quantity:', error);
      return { success: false, error: error.message };
    }
  }
};

window.VoidAPI = api;
