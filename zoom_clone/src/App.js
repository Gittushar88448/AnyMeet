import { Route, Routes } from 'react-router-dom';
import './App.css';
import Home from './pages/Home';
import Auth from './pages/Auth';
import EmailVerification from './components/EmailVerification';
import Dashboard from './pages/Dashboard';
import Error from './pages/Error';
import OpenRoute from './components/proctedAuth/openRoute';
import ProtectedRoute from './components/proctedAuth/protectedRoute';
import VideoComponent from './pages/VideoComponent';
import HistoryPage from './pages/HistoryPage';
function App() {
  return (
    <div className="App">
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/auth' element={
          <OpenRoute>
            <Auth />
          </OpenRoute>
        } />
        <Route path='/auth/verify-otp' element={<EmailVerification />} />

        <Route path='/dashboard' element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } />

        <Route path='/dashboard/:url' element={          
          <ProtectedRoute>
            <VideoComponent />
          </ProtectedRoute>
        }/>
        <Route path='/dashboard/history' element={          
          <ProtectedRoute>
            <HistoryPage />
          </ProtectedRoute>
        }/>
        <Route path='*' element={<Error />} />
      </Routes>
    </div>
  );
}

export default App;
