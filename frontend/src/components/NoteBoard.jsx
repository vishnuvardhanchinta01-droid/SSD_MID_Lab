import { useState, useEffect } from 'react';
import { RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import StickyNote from './StickyNote';
import FilterBar from './FilterBar';
import { notesAPI } from '../api/notes';

const NoteBoard = ({ classroomId, isTeacher = false, onNoteDeleted }) => {
  const [notes, setNotes] = useState([]);
  const [filteredNotes, setFilteredNotes] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadNotes();
  }, [classroomId]);

  // Auto-refresh notes every 30 seconds for both students and teachers
  useEffect(() => {
    const interval = setInterval(() => {
      loadNotes();
    }, 30000); // Refresh every 30 seconds

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const filtered = filterNotes(notes, selectedStatus);
    setFilteredNotes(filtered);
  }, [notes, selectedStatus]);

  const loadNotes = async (isRefresh = false) => {
    if (isRefresh) {
      setRefreshing(true);
    }
    try {
      const classroomNotes = await notesAPI.getNotesByClassroom(classroomId);
      setNotes(classroomNotes);
    } catch (error) {
      console.error('Error loading notes:', error);
    } finally {
      setLoading(false);
      if (isRefresh) {
        setRefreshing(false);
      }
    }
  };

  const handleDeleteNote = async (noteId) => {
    try {
      await notesAPI.deleteNote(noteId);
      setNotes(notes.filter(note => note.id !== noteId));
      onNoteDeleted && onNoteDeleted();
    } catch (error) {
      console.error('Error deleting note:', error);
    }
  };

  const handleStatusUpdate = async (noteId, newStatus) => {
    try {
      await notesAPI.updateNoteStatus(noteId, newStatus);
      setNotes(notes.map(note => 
        note.id === noteId ? { ...note, status: newStatus } : note
      ));
    } catch (error) {
      console.error('Error updating note status:', error);
    }
  };

  const filterNotes = (notes, status) => {
    if (!status || status === 'all') return notes;
    return notes.filter(note => note.status === status);
  };

  const statuses = ['all', 'unanswered', 'answered', 'important'];

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <FilterBar
          categories={statuses}
          selectedCategory={selectedStatus}
          onCategoryChange={setSelectedStatus}
        />
        <Button
          variant="outline"
          size="sm"
          onClick={() => loadNotes(true)}
          disabled={refreshing}
          className="flex items-center gap-2"
        >
          <RefreshCw size={14} className={refreshing ? 'animate-spin' : ''} />
          {refreshing ? 'Refreshing...' : 'Refresh'}
        </Button>
      </div>

      {filteredNotes.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground text-lg">
            {notes.length === 0 ? 'No questions yet! Students can start adding their questions.' : 'No questions in this status.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredNotes.map(note => (
            <StickyNote
              key={note.id}
              note={note}
              onDelete={handleDeleteNote}
              onStatusUpdate={handleStatusUpdate}
              isTeacher={isTeacher}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default NoteBoard;