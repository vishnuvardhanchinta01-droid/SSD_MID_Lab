const API_BASE_URL = 'http://localhost:5000'; // Adjust if needed

export const classroomAPI = {
  // Create classroom
  createClassroom: async (name) => {
    const response = await fetch(`${API_BASE_URL}/teacher/classroom`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({ name }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to create classroom');
    }

    return await response.json();
  },

  // Get classrooms by teacher
  getClassrooms: async () => {
    const response = await fetch(`${API_BASE_URL}/teacher/classrooms`, {
      credentials: 'include',
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to fetch classrooms');
    }

    return await response.json();
  },

  // Join classroom by code
  joinClassroom: async (code, studentName) => {
    const response = await fetch(`${API_BASE_URL}/teacher/classroom/code/${code}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'omit',
      body: JSON.stringify({ studentName }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to join classroom');
    }

    return await response.json();
  },

  // Delete classroom
  deleteClassroom: async (code) => {
    const response = await fetch(`${API_BASE_URL}/teacher/classroom/${code}`, {
      method: 'DELETE',
      credentials: 'include',
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to delete classroom');
    }

    return await response.json();
  },

  // Get classroom by code (for TA access)
  getClassroomByCode: async (code) => {
    const response = await fetch(`${API_BASE_URL}/teacher/classroom/code/${code}`, {
      method: 'GET',
      credentials: 'omit',
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Classroom not found');
    }

    return await response.json();
  }
};