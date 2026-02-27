const API_URL = process.env.REACT_APP_BACKEND_URL || '';

const api = {
  async fetch(endpoint, options = {}) {
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    try {
      const response = await window.fetch(`${API_URL}${endpoint}`, {
        ...options,
        headers,
        credentials: 'include',  // Send HttpOnly cookies
      });

      if (response.status === 401) {
        // Redirect to login - will be handled by HashRouter
        window.location.href = window.location.origin + '/#/login';
        throw new Error('Non autenticato');
      }

      if (!response.ok) {
        const error = await response.json().catch(() => ({ detail: 'Errore del server' }));
        throw new Error(error.detail || 'Errore del server');
      }

      return await response.json();
    } catch (error) {
      if (error.message === 'Non autenticato') throw error;
      throw error;
    }
  },

  get: (endpoint) => api.fetch(endpoint),
  post: (endpoint, data) => api.fetch(endpoint, { method: 'POST', body: JSON.stringify(data) }),
  put: (endpoint, data) => api.fetch(endpoint, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (endpoint) => api.fetch(endpoint, { method: 'DELETE' }),
};

export default api;
export { API_URL };
