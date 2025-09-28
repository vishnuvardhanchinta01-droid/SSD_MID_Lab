import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Plus, LogOut } from 'lucide-react';
import Navbar from '../components/Navbar';
import NoteBoard from '../components/NoteBoard';
import NoteForm from '../components/NoteForm';
import { notesAPI } from '../api/notes';
import { useToast } from '@/hooks/use-toast';
import Loader from '../components/Loader';

const StudentDashboard = () => {
  const [classroom, setClassroom] = useState(null);
  const [showNoteForm, setShowNoteForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [existingQuestions, setExistingQuestions] = useState([]);
  const [loadingQuestions, setLoadingQuestions] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    loadStudentData();
  }, []);

  // Load existing questions when form is shown
  useEffect(() => {
    if (showNoteForm && classroom) {
      loadExistingQuestions();
    }
  }, [showNoteForm, classroom]);

  const loadStudentData = async () => {
    try {
      const studentData = localStorage.getItem('currentStudent');
      if (!studentData) {
        toast({
          title: "Session Expired",
          description: "Please join a classroom again.",
          variant: "destructive"
        });
        navigate('/student-join');
        return;
      }

      const student = JSON.parse(studentData);
      setClassroom({
        _id: student.classroomId,
        name: student.classroomName || 'Classroom'
      });
    } catch (error) {
      console.error('Error loading student data:', error);
      toast({
        title: "Error",
        description: "Failed to load classroom data.",
        variant: "destructive"
      });
      navigate('/');
    } finally {
      setLoading(false);
    }
  };

  const loadExistingQuestions = async () => {
    setLoadingQuestions(true);
    try {
      const questions = await notesAPI.getNotesByClassroom(classroom._id);
      setExistingQuestions(questions);
    } catch (error) {
      console.error('Error loading existing questions:', error);
      setExistingQuestions([]);
      toast({
        title: "Warning",
        description: "Could not load existing questions for duplicate checking.",
        variant: "destructive"
      });
    } finally {
      setLoadingQuestions(false);
    }
  };

  const handleAddNote = async (noteData) => {
    try {
      await notesAPI.addNote(classroom._id, noteData);
      setShowNoteForm(false);
      setRefreshTrigger(prev => prev + 1);
      toast({
        title: "Question Added!",
        description: "Your question has been posted successfully."
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add question.",
        variant: "destructive"
      });
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('currentStudent');
    toast({
      title: "Logged Out",
      description: "You have been logged out of the classroom."
    });
    navigate('/');
  };

  const handleNoteDeleted = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  if (loading) {
    return <Loader message="Loading your classroom..." />;
  }

  if (!classroom) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground">Classroom not found</p>
          <Button onClick={() => navigate('/')} className="mt-4">
            Go Home
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar 
        user={null}
        userType="student"
        onLogout={handleLogout}
        classroomInfo={classroom}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Student Dashboard</h1>
            <p className="text-muted-foreground">
              Share your questions and see responses from your teacher
            </p>
          </div>

          <Button 
            onClick={() => setShowNoteForm(true)}
            className="bg-gradient-primary text-white shadow-hover"
          >
            <Plus size={16} className="mr-2" />
            Ask Question
          </Button>
        </div>

        {showNoteForm && (
          <div className="mb-8">
            <NoteForm 
              onSubmit={handleAddNote}
              onCancel={() => setShowNoteForm(false)}
              existingQuestions={existingQuestions}
              loadingQuestions={loadingQuestions}
            />
          </div>
        )}

        <NoteBoard
          classroomId={classroom._id}
          isTeacher={false}
          onNoteDeleted={handleNoteDeleted}
          key={refreshTrigger}
        />
      </div>
    </div>
  );
};

export default StudentDashboard;
