/**
 * Login Page
 * User authentication page
 */

import { Component, createSignal, Show } from 'solid-js';
import { useNavigate } from '@solidjs/router';
import { useAuth } from '../../services/authStore';
import { authAPI } from './api';

const LoginPage: Component = () => {
  const navigate = useNavigate();
  const auth = useAuth();

  const [email, setEmail] = createSignal('');
  const [password, setPassword] = createSignal('');
  const [error, setError] = createSignal<string | null>(null);
  const [isLoading, setIsLoading] = createSignal(false);

  const handleSubmit = async (e: Event) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const response = await authAPI.login({
        email: email(),
        password: password(),
      });

      if (response.success && response.data) {
        // Save token and user to auth store
        auth.login(response.data.token, response.data.user);
        navigate('/dashboard');
      } else {
        setError(response.message || 'Login failed');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div class="login-page">
      <div class="login-container">
        <h1>Login</h1>

        <Show when={error()}>
          <div class="error-message">{error()}</div>
        </Show>

        <form onSubmit={handleSubmit} class="login-form">
          <div class="form-group">
            <label for="email">Email</label>
            <input
              id="email"
              type="email"
              value={email()}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
              disabled={isLoading()}
            />
          </div>

          <div class="form-group">
            <label for="password">Password</label>
            <input
              id="password"
              type="password"
              value={password()}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
              disabled={isLoading()}
            />
          </div>

          <button type="submit" disabled={isLoading()}>
            {isLoading() ? 'Logging in...' : 'Login'}
          </button>
        </form>
      </div>

      <style>{`
        .login-page {
          display: flex;
          justify-content: center;
          align-items: center;
          min-height: 100vh;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        }

        .login-container {
          background: white;
          padding: 2rem;
          border-radius: 8px;
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
          width: 100%;
          max-width: 400px;
        }

        .login-container h1 {
          text-align: center;
          color: #333;
          margin-bottom: 1.5rem;
        }

        .login-form {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .form-group {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .form-group label {
          font-weight: 500;
          color: #333;
        }

        .form-group input {
          padding: 0.75rem;
          border: 1px solid #ddd;
          border-radius: 4px;
          font-size: 1rem;
        }

        .form-group input:focus {
          outline: none;
          border-color: #667eea;
          box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
        }

        button {
          padding: 0.75rem;
          background: #667eea;
          color: white;
          border: none;
          border-radius: 4px;
          font-size: 1rem;
          font-weight: 600;
          cursor: pointer;
          transition: background 0.3s;
        }

        button:hover:not(:disabled) {
          background: #5568d3;
        }

        button:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .error-message {
          background: #fee;
          color: #c33;
          padding: 0.75rem;
          border-radius: 4px;
          border-left: 4px solid #c33;
          margin-bottom: 1rem;
        }
      `}</style>
    </div>
  );
};

export default LoginPage;
