import { Navigate, Route, Routes } from 'react-router-dom';
import { useAuth } from './auth';
import LoginPage from './pages/LoginPage';
import Dashboard from './pages/Dashboard';
import LabelEditor from './pages/LabelEditor';
import ArchivePage from './pages/ArchivePage';

function PrivateRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) {
    return (
      <div className="boot-screen">
        <div className="boot-mark">Sapigen</div>
        <p>Loading workspace…</p>
      </div>
    );
  }
  return user ? children : <Navigate to="/login" replace />;
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route
        path="/"
        element={
          <PrivateRoute>
            <Dashboard />
          </PrivateRoute>
        }
      />
      <Route
        path="/create"
        element={
          <PrivateRoute>
            <LabelEditor />
          </PrivateRoute>
        }
      />
      <Route
        path="/edit/:id"
        element={
          <PrivateRoute>
            <LabelEditor />
          </PrivateRoute>
        }
      />
      <Route
        path="/archive"
        element={
          <PrivateRoute>
            <ArchivePage />
          </PrivateRoute>
        }
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
