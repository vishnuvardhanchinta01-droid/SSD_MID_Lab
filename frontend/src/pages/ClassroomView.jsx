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
  const { user, logout } = useAuth();
  const [userType, setUserType] = useState(null);
  const [classroom, setClassroom] = useState(null);
  const [showNoteForm, setShowNoteForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const navigate = useNavigate();
  const { classroomId } = useParams();
  const { toast } = useToast();

  useEffect(() => {
    loadClassroomData();
  }, []);

  const loadClassroomData = async () => {
    if (!classroomId) {
      navigate('/');
      return;
    }

    try {
      if (user) {
        // Teacher
        setUserType('teacher');
        // For teacher, assume classroomId is valid since they navigated here
        // Could fetch all and find, but for now, set placeholder
        setClassroom({ _id: classroomId, name: 'Classroom' }); // TODO: fetch classroom details
      } else {
        // Student
        const studentData = localStorage.getItem('currentStudent');
        if (studentData) {
          const student = JSON.parse(studentData);
          if (student.classroomId === classroomId) {
            setUserType('student');
            setClassroom({ _id: classroomId, name: student.classroomName || 'Classroom' });
          }
        }
      }

      if (!userType) {
        // For students, if not matching, show not found instead of redirect
        if (localStorage.getItem('currentStudent')) {
          setUserType('student');
          setClassroom({ _id: classroomId, name: 'Classroom' });
        } else {
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

  if (loading) {
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
                ? `Managing questions from ${classroom.students?.length || 0} students`
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