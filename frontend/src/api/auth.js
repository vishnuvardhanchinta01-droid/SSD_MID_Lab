const API_BASE_URL = 'http://localhost:5000'; // Adjust if needed

export const authAPI = {
  // Teacher signup
  signup: async (teacherData) => {
    const response = await fetch(`${API_BASE_URL}/teacher/signup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(teacherData),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Signup failed');
    }

    return await response.json();
  },

  // Teacher login
  login: async (username, password) => {
    const response = await fetch(`${API_BASE_URL}/teacher/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({ username, password }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Login failed');
    }

    return await response.json();
  },

  // Logout
  logout: async () => {
    const response = await fetch(`${API_BASE_URL}/teacher/logout`, {
      method: 'POST',
      credentials: 'include',
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Logout failed');
    }

    return await response.json();
  },

  // Get current teacher
  getCurrentTeacher: async () => {
    const response = await fetch(`${API_BASE_URL}/teacher/me`, {
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error('Not authenticated');
    }

    return await response.json();
  }
};