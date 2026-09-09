import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import MissionScreen from './MissionScreen';
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

export default function Dashboard({ team, teamName, onExit }) {
  const teamNumber = team?.team_number ?? teamName;
  const [gameState, setGameState] = useState(EMPTY_GAME_STATE);
  const [teamRecord, setTeamRecord] = useState(team || null);
  const [loading, setLoading] = useState(true);
  const [scoreInput, setScoreInput] = useState('');
  const [savingScore, setSavingScore] = useState(false);
  const [message, setMessage] = useState('');
  const [missionStarted, setMissionStarted] = useState(false);

  const isImposter = String(teamRecord?.role || team?.role || '').toUpperCase() === 'IMPOSTER';
  const displayTeam = teamRecord?.team_name || `TEAM ${String(teamNumber || '').padStart(2, '0')}`;
  const score = Number(teamRecord?.score || 0);

  const load = async () => {
    try {
      const [gameResult, teamResult] = await Promise.all([
        supabase.from('game_state').select('*').order('updated_at', { ascending: false }).limit(1).maybeSingle(),
        supabase.from('teams').select('*').eq('team_number', teamNumber).maybeSingle(),
      ]);
      if (gameResult.error) throw gameResult.error;
      if (teamResult.error) throw teamResult.error;
      setGameState({ ...EMPTY_GAME_STATE, ...(gameResult.data || {}) });
      if (teamResult.data) setTeamRecord(teamResult.data);
    } catch (err) {
      console.error('PLAYER LOAD ERROR:', err);
      setMessage(err.message || 'Unable to load live game state.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, [teamNumber]);

  useEffect(() => {
    const gameChannel = supabase
      .channel(`player-game-${teamNumber}`)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'game_state' }, (payload) => {
        if (payload.new) setGameState((current) => ({ ...current, ...payload.new }));
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'teams', filter: `team_number=eq.${teamNumber}` }, (payload) => {
        if (payload.new) setTeamRecord((current) => ({ ...current, ...payload.new }));
      })
      .subscribe();
    return () => { supabase.removeChannel(gameChannel); };
  }, [teamNumber]);

  const liveSeconds = useLiveTimer(gameState);
  const formatTime = (value) => `${Math.floor(value / 60).toString().padStart(2, '0')}:${(value % 60).toString().padStart(2, '0')}`;
  if (missionStarted) {
    return (
      <MissionScreen
        onExit={() => setMissionStarted(false)}
        timer={formatTime(liveSeconds)}
      />
    );
  }

  const submitScore = async () => {
    const value = Number(scoreInput);
    if (!Number.isFinite(value) || value < 0) {
      setMessage('ENTER A VALID SCORE.');
      return;
    }
    setSavingScore(true);
    setMessage('');
    try {
      // The normal event setup should expose this update through RLS.
      const { data, error } = await supabase
        .from('teams')
        .update({ score: Math.round(value) })
        .eq('team_number', teamNumber)
        .select('*')
        .single();
      if (error) throw error;
      setTeamRecord(data);
      setScoreInput('');
      setMessage('SCORE SAVED');
    } catch (err) {
      console.error('SCORE UPDATE ERROR:', err);
      setMessage(err.message || 'SCORE COULD NOT BE SAVED');
    } finally {
      setSavingScore(false);
    }
  };

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
                onEnterMission={() => setMissionStarted(true)}
              /></div>
              <div className="lg:col-span-3"><RoundTablePanel open={gameState.round_table_open} /></div>
              <div className="lg:col-span-3"><CrewStatus currentTeam={displayTeam} /></div>
            </div>

            <section className="border border-[#7C3AED]/80 bg-[#160A27]/70 p-5 shadow-[0_0_20px_rgba(124,58,237,0.2)]">
              <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
                <div>
                  <div className="text-xs font-bold text-[#C084FC] tracking-[0.25em] uppercase">TEAM SCORE</div>
                  <div className="text-white/40 text-xs mt-1 uppercase tracking-widest">Submit your team's current score</div>
                </div>
                <div className="flex gap-3">
                  <input type="number" min="0" value={scoreInput} onChange={(e) => setScoreInput(e.target.value)} placeholder={String(score)} className="w-32 bg-black/50 border border-white/10 px-4 py-3 text-white outline-none focus:border-purple-500" />
                  <button onClick={submitScore} disabled={savingScore} className="px-6 py-3 bg-purple-700 hover:bg-purple-600 font-black uppercase tracking-wider disabled:opacity-50">{savingScore ? 'SAVING...' : 'SAVE SCORE'}</button>
                </div>
              </div>
            </section>
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