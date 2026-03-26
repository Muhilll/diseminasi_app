/**
 * Protected Page Component
 * Wrapper for page components that require authentication
 */

import { Component, JSX, Show, createMemo } from "solid-js";
import { useAuth } from '../services/authStore';

interface ProtectedPageProps {
  children: JSX.Element;
}

const ProtectedPage: Component<ProtectedPageProps> = (props) => {
  const auth = useAuth();

  // Check if authenticated - use memo to reactively check
  const isAuthenticated = createMemo(() => auth.isAuthenticated());

  return (
    <Show when={isAuthenticated()}>
      {props.children}
    </Show>
  );
};

export default ProtectedPage;
