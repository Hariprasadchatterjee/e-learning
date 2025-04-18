import { Navigate, Outlet } from 'react-router-dom';

interface ProtectedRouteProps {
  isLoggedIn: boolean;
  isAdmin?: boolean;
  adminOnly?: boolean;
  redirectPath?: string;
  children?: React.ReactNode;
}

const ProtectedRoute = ({
  isLoggedIn,
  isAdmin = false,
  adminOnly = false,
  redirectPath = '/login',
  children,
}: ProtectedRouteProps) => {
  if (!isLoggedIn) {
    return <Navigate to={redirectPath} replace />;
  }

  if (adminOnly && !isAdmin) {
    return <Navigate to="/" replace />; // or redirect to '/access-denied'
  }

  return children ? children : <Outlet />;
};

export default ProtectedRoute;