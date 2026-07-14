import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import './global.css';
import App from './App.jsx';
import { AuthProvider } from './context/AuthContext';
import { CoursesProvider } from './context/CoursesContext';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <CoursesProvider>
        <App />
      </CoursesProvider>
    </AuthProvider>
  </StrictMode>,
);
