import './App.css';
import { createBrowserRouter, Navigate, RouterProvider } from 'react-router-dom';
import ProtectedRoute from './middleware/ProtectedRoute';
import { useSelector } from 'react-redux';
import { RootState } from './components/store/store';

// Layout and Pages
import Root from './app/layout/Root';
import Home from './app/layout/pages/Home';
import NotFound from './app/layout/pages/NotFound';
import Courses from './app/layout/pages/Courses';
import Login from './app/layout/pages/auth/Login';
import Register from './app/layout/pages/auth/Register';
import ForgotPassword from './app/layout/pages/auth/ForgotPassword';
import ResetPassword from './app/layout/pages/auth/ResetPassword';
import Contact from './app/layout/pages/Contact';
import Request from './app/layout/pages/Request';
import Subscription from './app/layout/pages/Subscription';
import AboutPage from './app/layout/pages/About';
import PaymentSuccess from './app/layout/pages/PaymentSuccess';
import CourseLecture from './app/layout/pages/CourseLecture';
import Profile from './app/layout/pages/Profile/Profile';
import ChangePassword from './app/layout/pages/Profile/ChangePassword';
import UpdateProfile from './app/layout/pages/Profile/Update';
import Dashboard from './app/layout/pages/Admin/Dashboard';
import CreateCourse from './app/layout/pages/Admin/CreateCourse';
import AdminCourses from './app/layout/pages/Admin/AdminCourses';
import Users from './app/layout/pages/Admin/Users';

function App() {
  const { isLoggedIn, user } = useSelector((state: RootState) => state.auth);
  console.log("isLoggedIn",isLoggedIn);
  
  
  const router = createBrowserRouter([
    {
      path: '/',
      element: <Root />,
      errorElement: <NotFound />,
      children: [
        { path: '/', element: <Home /> },
        { path: '/courses/:id', element: <CourseLecture /> },
        { path: '/courses', element: <Courses /> },
        { path: '/about', element: <AboutPage /> },
        {
          path: '/login',
          element: (
            <ProtectedRoute isLoggedIn={!isLoggedIn} redirectPath="/login">
              <Login />
            </ProtectedRoute>
          ),
        },
        {
          path: '/register',
          element: (
            <ProtectedRoute isLoggedIn={!isLoggedIn} redirectPath="/register">
              <Register />
            </ProtectedRoute>
          ),
        },
        {
          path: '/profile',
          element: (
            <ProtectedRoute isLoggedIn={isLoggedIn} redirectPath="/profile">
              <Profile />
            </ProtectedRoute>
          ),
        },
        {
          path: '/changePassword',
          element: (
            <ProtectedRoute isLoggedIn={isLoggedIn} redirectPath="/changePassword">
              <ChangePassword />
            </ProtectedRoute>
          ),
        },
        {
          path: '/updateprofile',
          element: (
            <ProtectedRoute isLoggedIn={isLoggedIn} redirectPath="/updateprofile">
              <UpdateProfile />
            </ProtectedRoute>
          ),
        },
        { path: '/forgotPassword', element: <ForgotPassword /> },
        { path: '/resetPassword/:token', element: <ResetPassword /> },
        { path: '/contact', element: <Contact /> },
        { path: '/request', element: <Request /> },
        {
          path: '/subscription',
          element: (
            <ProtectedRoute isLoggedIn={isLoggedIn} redirectPath="/subscription">
              <Subscription />
            </ProtectedRoute>
          ),
        },
        { path: '/paymentSuccess', element: <PaymentSuccess /> },
        {
          path: '/admin',
          element: (
            <ProtectedRoute 
              isLoggedIn={isLoggedIn} 
              isAdmin={user?.role === 'admin'}
              adminOnly={true}
              redirectPath="/dashboard"
            />
          ),
          children: [
            { index: true, element: <Navigate to="/admin/dashboard" replace /> },
            { path: 'dashboard', element: <Dashboard /> },
            { path: 'create-course', element: <CreateCourse /> },
            { path: 'courses', element: <AdminCourses /> },
            { path: 'users', element: <Users /> },
          ],
        }
      ],
    },
  ]);

  return <RouterProvider router={router} />;
}

export default App;