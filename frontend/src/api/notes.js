const API_BASE_URL = 'http://localhost:5000'; // Adjust if needed

export const notesAPI = {
  // Add note to classroom
  addNote: async (classroomId, noteData) => {
    const response = await fetch(`${API_BASE_URL}/question`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({
        classroom_id: classroomId,
        question: noteData.question,
        author: noteData.studentName,
        color: noteData.color,
        category: noteData.category
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to add note');
    }

    const data = await response.json();
    // Map backend response to frontend format
    return {
      id: data._id,
      studentName: data.author,
      question: data.question,
      color: data.color,
      category: data.category,
      createdAt: data.timestamp
    };
  },

  // Delete note (teachers only)
  deleteNote: async (noteId) => {
    const response = await fetch(`${API_BASE_URL}/question/${noteId}`, {
      method: 'DELETE',
      credentials: 'include',
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to delete note');
    }

    return await response.json();
  },

  // Update note status (teachers only)
  updateNoteStatus: async (noteId, status) => {
    const response = await fetch(`${API_BASE_URL}/question/${noteId}/status`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({ status }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to update status');
    }

    return await response.json();
  },

  // Get notes by classroom
  getNotesByClassroom: async (classroomId) => {
    const response = await fetch(`${API_BASE_URL}/question/${classroomId}`, {
      credentials: 'include',
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to fetch notes');
    }

    const data = await response.json();
    // Map to frontend format
    return data.map(note => ({
      id: note._id,
      studentName: note.author,
      question: note.question,
      color: note.color,
      category: note.category,
      status: note.status,
      createdAt: note.timestamp
    }));
  },

  // Filter notes by category
  filterNotes: (notes, category) => {
    if (!category || category === 'all') return notes;
    return notes.filter(note => note.category === category);
  }
};