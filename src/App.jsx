import { useEffect, useState } from 'react';
import { AnimatePresence } from 'framer-motion';

import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import SplashScreen from './components/SplashScreen';
import LobbyScreen from './components/LobbyScreen';
import AuthModal from './components/AuthModal';
import RoleCardScreen from './components/RoleCardScreen';
import MissionBriefScreen from './components/MissionBriefScreen';
import Dashboard from './components/Dashboard';
import MissionScreen from "./components/MissionScreen";


function App() {
  // The public/player experience is the default. Admin is a separate control surface.
  const [appState, setAppState] = useState('splash');
  const [loggedInTeam, setLoggedInTeam] = useState(null);

  {
    appState === "mission" && loggedInTeam && (
      <MissionScreen
        key="mission"
        onExit={() => setAppState("dashboard")}
        timer="40:00"
      />
    )
  }

  useEffect(() => {
    const saved = sessionStorage.getItem('paradox_team');
    if (saved) {
      try {
        setLoggedInTeam(JSON.parse(saved));
        setAppState('dashboard');
      } catch {
        sessionStorage.removeItem('paradox_team');
      }
    }
  }, []);

  const handleSplashComplete = () => setAppState('lobby');
  const handleEnterLobby = () => setAppState('auth');

  const handleLogin = (teamData) => {
    console.log('LOGIN SUCCESS:', teamData);
    setLoggedInTeam(teamData);
    sessionStorage.setItem('paradox_team', JSON.stringify(teamData));
    setAppState('role');
  };

  const exitPlayer = () => {
    sessionStorage.removeItem('paradox_team');
    setLoggedInTeam(null);
    setAppState('lobby');
  };

  return (
    <div className="w-full min-h-screen bg-paradox-black overflow-hidden relative">
      <AnimatePresence mode="wait">
        {appState === 'admin' && (
          <AdminDashboard key="admin" onExit={() => setAppState('lobby')} />
        )}

        {appState === 'splash' && (
          <SplashScreen key="splash" onComplete={handleSplashComplete} />
        )}

        {(appState === 'lobby' || appState === 'auth') && (
          <LobbyScreen key="lobby" onEnter={handleEnterLobby} />
        )}

        {appState === 'role' && loggedInTeam && (
          <RoleCardScreen
            key="role"
            teamName={loggedInTeam.team_number}
            role={loggedInTeam.role}
            onComplete={() => setAppState('mission')}
          />
        )}

        {appState === 'mission' && loggedInTeam && (
          <MissionBriefScreen
            key="mission"
            teamName={loggedInTeam.team_number}
            role={loggedInTeam.role}
            onComplete={() => setAppState('dashboard')}
          />
        )}

        {appState === 'dashboard' && loggedInTeam && (
          <Dashboard key="dashboard" team={loggedInTeam} onExit={exitPlayer} />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {appState === 'auth' && (
          <AuthModal key="auth" onLogin={handleLogin} />
        )}
      </AnimatePresence>

      {appState !== 'admin' && (
        <button
          onClick={() => setAppState('admin')}
          className="fixed bottom-4 right-4 z-[9999] bg-red-600 text-white px-4 py-2 rounded font-bold tracking-wider"
        >
          ADMIN
        </button>
      )}
    </div>
  );
}

export default App;
