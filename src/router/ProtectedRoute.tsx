/**
 * Protected Route Component
 * Wrapper for components that require authentication
 */

import { Show, Component, JSX } from "solid-js";
import { useNavigate } from '@solidjs/router';

interface ProtectedComponentProps {
  children: JSX.Element;
  isAuthenticated?: boolean;
}

const ProtectedComponent: Component<ProtectedComponentProps> = (props) => {
  const navigate = useNavigate();
  
  // Check if authenticated
  const isAuth = () => {
    return props.isAuthenticated || !!localStorage.getItem('authToken');
  };

  // Redirect to login if not authenticated
  if (!isAuth()) {
    navigate('/login', { replace: true });
    return null;
  }

  return <>{props.children}</>;
};

export default ProtectedComponent;
