import { createBrowserRouter } from 'react-router-dom';
import Landing from './pages/Landing';
import StudentJoin from './pages/StudentJoin';
import StudentDashboard from './pages/StudentDashboard';
import TeacherOptions from './pages/TeacherOptions';
import TeacherLogin from './pages/TeacherLogin';
import TeacherSignup from './pages/TeacherSignup';
import TeacherDashboard from './pages/TeacherDashboard';
import ClassroomView from './pages/ClassroomView';
import TALogin from './pages/TALogin';
import TASignup from './pages/TASignup';
import TAClassroomAccess from './pages/TAClassroomAccess';
import TADashboard from './pages/TADashboard';
import NotFound from './pages/NotFound';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Landing />,
  },
  {
    path: '/student-join',
    element: <StudentJoin />,
  },
  {
    path: '/student-dashboard',
    element: <StudentDashboard />,
  },
  {
    path: '/teacher-options',
    element: <TeacherOptions />,
  },
  {
    path: '/teacher-login',
    element: <TeacherLogin />,
  },
  {
    path: '/teacher-signup',
    element: <TeacherSignup />,
  },
  {
    path: '/teacher-dashboard',
    element: <TeacherDashboard />,
  },
  {
    path: '/classroom-view/:classroomId',
    element: <ClassroomView />,
  },
  {
    path: '/ta-login',
    element: <TALogin />,
  },
  {
    path: '/ta-signup',
    element: <TASignup />,
  },
  {
    path: '/ta-classroom-access',
    element: <TAClassroomAccess />,
  },
  {
    path: '/ta-dashboard',
    element: <TADashboard />,
  },
  {
    path: '*',
    element: <NotFound />,
  },
]);