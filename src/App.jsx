import { useEffect, useState } from 'react';
import { AnimatePresence } from 'framer-motion';

import AdminDashboard from './pages/AdminDashboard';
import SplashScreen from './components/SplashScreen';
import LobbyScreen from './components/LobbyScreen';
import AuthModal from './components/AuthModal';
import RoleCardScreen from './components/RoleCardScreen';
import Dashboard from './components/Dashboard';
import MissionScreen from "./pages/MissionScreen";

function App() {
  const [appState, setAppState] = useState('splash');
  const [loggedInTeam, setLoggedInTeam] = useState(null);

  useEffect(() => {
    const saved = sessionStorage.getItem('paradox_team');

    if (saved) {
      try {
        const team = JSON.parse(saved);

        setLoggedInTeam(team);
        setAppState('dashboard');

      } catch {
        sessionStorage.removeItem('paradox_team');
      }
    }
  }, []);

  const handleSplashComplete = () => {
    setAppState('lobby');
  };

  const handleEnterLobby = () => {
    setAppState('auth');
  };

  const handleLogin = (teamData) => {
    console.log('LOGIN SUCCESS:', teamData);

    setLoggedInTeam(teamData);

    sessionStorage.setItem(
      'paradox_team',
      JSON.stringify(teamData)
    );

    setAppState('role');
  };

  const handleRoleComplete = () => {
    setAppState('dashboard');
  };

  const startMission = () => {
    setAppState('mission');
  };

  const exitMission = () => {
    setAppState('dashboard');
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
          <AdminDashboard
            key="admin"
            onExit={() => setAppState('lobby')}
          />
        )}

        {appState === 'splash' && (
          <SplashScreen
            key="splash"
            onComplete={handleSplashComplete}
          />
        )}

        {(appState === 'lobby' || appState === 'auth') && (
          <LobbyScreen
            key="lobby"
            onEnter={handleEnterLobby}
          />
        )}

        {appState === 'role' && loggedInTeam && (
          <RoleCardScreen
            key="role"
            teamName={loggedInTeam.team_number}
            role={loggedInTeam.role}
            onComplete={handleRoleComplete}
          />
        )}

        {appState === 'dashboard' && loggedInTeam && (
          <Dashboard
            key="dashboard"
            team={loggedInTeam}
            onExit={exitPlayer}
            onEnterMission={startMission}
          />
        )}

        {appState === 'mission' && loggedInTeam && (
          <MissionScreen
            key="mission"
            teamName={loggedInTeam.team_number}
            role={loggedInTeam.role}
            onExit={exitMission}
          />
        )}

      </AnimatePresence>

      <AnimatePresence>
        {appState === 'auth' && (
          <AuthModal
            key="auth"
            onLogin={handleLogin}
          />
        )}
      </AnimatePresence>



      {/* Global Background Audio */}
      <audio 
        src="/audio/paradox%20audio.mpeg" 
        autoPlay 
        loop 
        onEnded={(e) => {
          e.target.currentTime = 0;
          e.target.play().catch(err => console.log("Audio play failed:", err));
        }}
      />

    </div>
  );
}

export default App;