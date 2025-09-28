import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import Navbar from '../components/Navbar';
import NoteBoard from '../components/NoteBoard';
import NoteForm from '../components/NoteForm';
import { classroomAPI } from '../api/classroom';
import { notesAPI } from '../api/notes';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '../context/AuthContext';
import Loader from '../components/Loader';

const ClassroomView = () => {
  const { user, logout, authLoading } = useAuth();
  const [userType, setUserType] = useState(null);
  const [classroom, setClassroom] = useState(null);
  const [showNoteForm, setShowNoteForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [existingQuestions, setExistingQuestions] = useState([]);
  const [loadingQuestions, setLoadingQuestions] = useState(false);
  const navigate = useNavigate();
  const { classroomId } = useParams();
  const { toast } = useToast();

  useEffect(() => {
    if (!authLoading) {
      loadClassroomData();
    }
  }, [authLoading]);

  // Load existing questions when form is shown for students
  useEffect(() => {
    if (showNoteForm && classroomId && userType === 'student') {
      loadExistingQuestions();
    }
  }, [showNoteForm, classroomId, userType]);

  const loadClassroomData = async () => {
    if (!classroomId) {
      navigate('/');
      return;
    }

    console.log('ClassroomView - Loading data for classroomId:', classroomId);
    console.log('ClassroomView - User:', user);

    try {
      if (user) {
        // Teacher
        console.log('ClassroomView - User is teacher, setting teacher type');
        setUserType('teacher');
        try {
          // Fetch teacher's classrooms to get the classroom name and student count
          const teacherClassrooms = await classroomAPI.getClassrooms();
          const currentClassroom = teacherClassrooms.classrooms.find(c => c.id === classroomId);
          if (currentClassroom) {
            setClassroom({ 
              _id: classroomId, 
              name: currentClassroom.name,
              studentCount: currentClassroom.studentCount || 0
            });
          } else {
            setClassroom({ _id: classroomId, name: 'Classroom', studentCount: 0 });
          }
        } catch (error) {
          console.error('Error fetching classroom details:', error);
          setClassroom({ _id: classroomId, name: 'Classroom', studentCount: 0 });
        }
      } else {
        // Redirect students to student dashboard
        console.log('ClassroomView - No teacher user, redirecting students to student dashboard');
        const studentData = localStorage.getItem('currentStudent');
        if (studentData) {
          console.log('ClassroomView - Student detected, redirecting to student dashboard');
          navigate('/student-dashboard');
        } else {
          console.log('ClassroomView - No user and no student data, redirecting to home');
          navigate('/');
        }
      }
    } catch (error) {
      console.error('Error loading classroom data:', error);
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
      const questions = await notesAPI.getNotesByClassroom(classroomId);
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
      await notesAPI.addNote(classroomId, noteData);
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
    if (userType === 'teacher') {
      logout();
      navigate('/');
    } else {
      localStorage.removeItem('currentStudent');
      navigate('/');
    }
  };

  const handleNoteDeleted = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  if (authLoading || loading) {
    return <Loader message="Loading classroom..." />;
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
        user={user}
        userType={userType}
        onLogout={handleLogout}
        classroomInfo={classroom}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Classroom</h1>
            <p className="text-muted-foreground">
              {userType === 'teacher' 
                ? `Managing questions from ${classroom.studentCount || 0} students`
                : 'Share your questions and doubts here'
              }
            </p>
          </div>

          {userType === 'student' && (
            <Button 
              onClick={() => setShowNoteForm(true)}
              className="bg-gradient-primary text-white shadow-hover"
            >
              <Plus size={16} className="mr-2" />
              Add Question
            </Button>
          )}
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
          classroomId={classroomId}
          isTeacher={userType === 'teacher'}
          onNoteDeleted={handleNoteDeleted}
          key={refreshTrigger}
        />
      </div>
    </div>
  );
};

export default ClassroomView;