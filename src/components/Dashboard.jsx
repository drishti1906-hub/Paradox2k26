import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import MissionScreen from "../pages/MissionScreen";
import ChallengePage from './ChallengePage';
import {
  DashboardNavbar,
  TeamIdentity,
  MissionHUD,
  MainMissionPanel,
  RoundTablePanel,
  CrewStatus,
  BottomSystemBar,
} from './DashboardSections';
import { supabase } from '../lib/supabase';

const EMPTY_GAME_STATE = {
  is_live: false,
  timer_running: false,
  timer_remaining: 0,
  timer_started_at: null,
  current_round: 1,
  phase: 'LOBBY',
  game_status: 'WAITING',
  round_table_open: false,
  voting_locked: true,
  votes_revealed: false,
  current_mission: null,
  admin_message: '',
};

export default function Dashboard({
  team,
  onExit,
  onEnterMission,
  phase = "MISSION_1",
}) {
  const teamNumber = team?.team_number ?? teamName;
  const [gameState, setGameState] = useState(EMPTY_GAME_STATE);
  const [teamRecord, setTeamRecord] = useState(team || null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [missionStarted, setMissionStarted] = useState(false);
  const [showChallenges, setShowChallenges] = useState(false);

  const isImposter = String(teamRecord?.role || team?.role || '').toUpperCase() === 'IMPOSTER';
  const displayTeam = teamRecord?.team_name || `TEAM ${String(teamNumber || '').padStart(2, '0')}`;
  const score = Number(teamRecord?.score || 0);

  const handleEnterMission = () => {
    setMissionStarted(true);
  };

  useEffect(() => {
    let isMounted = true;

    // 1. Subscribe to Realtime immediately so we don't miss anything during the fetch.
    const gameChannel = supabase
      .channel(`player-game-${teamNumber}`)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'game_state' }, (payload) => {
        if (payload.new && isMounted) {
          setGameState((current) => {
            const currentUpdated = new Date(current.updated_at || 0).getTime();
            const newUpdated = new Date(payload.new.updated_at || 0).getTime();
            if (currentUpdated > newUpdated) return current;
            return { ...current, ...payload.new };
          });
        }
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'teams', filter: `team_number=eq.${teamNumber}` }, (payload) => {
        if (payload.new && isMounted) setTeamRecord((current) => ({ ...current, ...payload.new }));
      })
      .subscribe();

    // 2. Fetch initial state securely
    const loadInitialState = async () => {
      try {
        const [gameResult, teamResult] = await Promise.all([
          supabase.from('game_state').select('*').order('updated_at', { ascending: false }).limit(1).maybeSingle(),
          supabase.from('teams').select('*').eq('team_number', teamNumber).maybeSingle(),
        ]);

        if (!isMounted) return;
        if (gameResult.error) throw gameResult.error;
        if (teamResult.error) throw teamResult.error;

        if (gameResult.data) {
          setGameState((current) => {
            const currentUpdated = new Date(current.updated_at || 0).getTime();
            const fetchUpdated = new Date(gameResult.data.updated_at || 0).getTime();
            // If realtime already fired a newer update, ignore this fetch data.
            if (currentUpdated > fetchUpdated) return current;
            return { ...EMPTY_GAME_STATE, ...gameResult.data };
          });
        }

        if (teamResult.data) {
          setTeamRecord((current) => ({ ...current, ...teamResult.data }));
        }
      } catch (err) {
        console.error('PLAYER LOAD ERROR:', err);
        if (isMounted) setMessage(err.message || 'Unable to load live game state.');
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    loadInitialState();

    return () => {
      isMounted = false;
      supabase.removeChannel(gameChannel);
    };
  }, [teamNumber]);

  // Enforce global phase logic to override local state
  useEffect(() => {
    if (gameState.phase !== 'MISSION') {
      setMissionStarted(false);
      setShowChallenges(false);
    }
  }, [gameState.phase]);

  const liveSeconds = useLiveTimer(gameState);
  const formatTime = (value) => `${Math.floor(value / 60).toString().padStart(2, '0')}:${(value % 60).toString().padStart(2, '0')}`;

  if (gameState.game_status === 'WAITING') {
    return (
      <div className="flex flex-col h-screen w-full bg-[#05030A] items-center justify-center text-white p-6 text-center">
        <h1 className="text-4xl md:text-5xl font-black tracking-widest text-[#8B5CF6] mb-4">WAITING FOR GAME TO START</h1>
        <p className="text-[#A7A0B8] tracking-widest uppercase">The Admin will initiate the mission shortly.</p>
        <div className="mt-8 animate-pulse text-[#8B5CF6]/50">...</div>
      </div>
    );
  }

  if (gameState.game_status === 'ENDED') {
    return (
      <div className="flex flex-col h-screen w-full bg-[#05030A] items-center justify-center text-white p-6 text-center">
        <h1 className="text-4xl md:text-5xl font-black tracking-widest text-red-500 mb-4">GAME ENDED</h1>
        <p className="text-[#A7A0B8] tracking-widest uppercase">Thank you for playing.</p>
        <div className="text-2xl mt-8 tracking-widest font-bold">YOUR SCORE: <span className="text-[#22C55E]">{score}</span></div>
      </div>
    );
  }

  if (missionStarted && gameState.phase === 'MISSION') {
    return (
      <MissionScreen
        onExit={() => setMissionStarted(false)}
        timer={formatTime(liveSeconds)}
      />
    );
  }

  if (showChallenges && gameState.phase === 'MISSION') {
    return (
      <ChallengePage
        onBack={() => setShowChallenges(false)}
      />
    );
  }



  return (
    <div className="flex flex-col h-screen w-full bg-[#05030A] overflow-hidden font-sans selection:bg-[#7C3AED] selection:text-white">
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-40" style={{ backgroundImage: 'url(/splash-bg.jpg)' }} />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#160A27]/80 via-[#05030A]/90 to-[#05030A]/95 mix-blend-multiply" />
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'linear-gradient(#8B5CF6 1px, transparent 1px), linear-gradient(90deg, #8B5CF6 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
      </div>

      <motion.div className="relative z-10 flex flex-col h-full w-full" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <DashboardNavbar teamName={displayTeam} onExit={onExit} />
        <main className="flex-1 overflow-y-auto overflow-x-hidden p-4 sm:p-6 lg:p-8 custom-scrollbar">
          <div className="max-w-[1600px] mx-auto w-full flex flex-col gap-6">
            {loading && <div className="border border-purple-500/30 p-4 text-purple-300 tracking-widest uppercase">Connecting to game control...</div>}
            {gameState.admin_message && <div className="border border-yellow-500/30 bg-yellow-950/20 p-4 text-yellow-200 font-bold">{gameState.admin_message}</div>}
            {message && <div className="border border-purple-500/30 bg-purple-950/20 p-3 text-purple-200 text-sm tracking-wider">{message}</div>}

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              <TeamIdentity teamName={displayTeam} isImposter={isImposter} />
              <div className="lg:col-span-3"><MissionHUD timer={formatTime(liveSeconds)} timeInSeconds={liveSeconds} score={score} /></div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-[400px]">
              <div className="lg:col-span-6"><MainMissionPanel
                onEnterMission={onEnterMission}
                phase="MISSION_1"
              /></div>
              <div className="lg:col-span-3"><RoundTablePanel open={gameState.round_table_open} /></div>
              <div className="lg:col-span-3"><CrewStatus currentTeam={displayTeam} /></div>
            </div>


          </div>
        </main>
        <BottomSystemBar />
      </motion.div>
    </div>
  );
}

function useLiveTimer(gameState) {
  const calculateRemaining = () => {
    const remaining = Math.max(
      0,
      Number(gameState.timer_remaining) || 0
    );

    if (
      !gameState.timer_running ||
      !gameState.timer_started_at
    ) {
      return remaining;
    }

    const startedAt = new Date(
      gameState.timer_started_at
    ).getTime();

    if (!Number.isFinite(startedAt)) {
      return remaining;
    }

    const elapsed = Math.floor(
      (Date.now() - startedAt) / 1000
    );

    return Math.max(0, remaining - elapsed);
  };

  const [seconds, setSeconds] = useState(calculateRemaining);

  useEffect(() => {
    const update = () => {
      setSeconds(calculateRemaining());
    };

    update();

    if (!gameState.timer_running) {
      return;
    }

    const interval = window.setInterval(update, 1000);

    return () => {
      window.clearInterval(interval);
    };
  }, [
    gameState.timer_running,
    gameState.timer_started_at,
    gameState.timer_remaining,
  ]);

  return seconds;
}