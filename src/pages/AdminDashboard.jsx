import { useCallback, useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '../lib/supabase';
import {
    Activity,
    AlertTriangle,
    CheckCircle2,
    Clock3,
    Lock,
    Play,
    RefreshCw,
    RotateCcw,
    Shield,
    Square,
    Trophy,
    Unlock,
    Users,
    Vote,
} from 'lucide-react';

const TOTAL_TEAMS = 10;

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
    game_started_at: null,
    game_ended_at: null,
};

export default function AdminDashboard({ onExit }) {
    const [isAdmin, setIsAdmin] = useState(false);
    const [checkingAdmin, setCheckingAdmin] = useState(true);


    useEffect(() => {
        checkAdmin();
    }, []);

    const handleAdminLogout = async () => {
        try {
            const { error } = await supabase.auth.signOut();

            if (error) {
                console.error("LOGOUT ERROR:", error);
                return;
            }

            window.location.reload();
        } catch (error) {
            console.error("LOGOUT ERROR:", error);
        }
    };
    const checkAdmin = async () => {
        try {
            setCheckingAdmin(true);

            const {
                data: { session },
            } = await supabase.auth.getSession();

            console.log('SUPABASE SESSION:', session);

            const {
                data: { user },
                error,
            } = await supabase.auth.getUser();

            console.log('SUPABASE USER:', user);
            console.log('AUTH ERROR:', error);

            if (!user) {
                setIsAdmin(false);
                return;
            }

            const { data: admin, error: adminError } = await supabase
                .from('admin_users')
                .select('user_id')
                .eq('user_id', user.id)
                .maybeSingle();

            console.log('ADMIN RECORD:', admin);
            console.log('ADMIN QUERY ERROR:', adminError);

            setIsAdmin(!!admin);

        } catch (error) {
            console.error('CHECK ADMIN ERROR:', error);
            setIsAdmin(false);
        } finally {
            setCheckingAdmin(false);
        }
    };

    const [gameState, setGameState] = useState(EMPTY_GAME_STATE);
    const [teams, setTeams] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [actionLoading, setActionLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [adminMessage, setAdminMessage] = useState('');

    const showSuccess = useCallback((message) => {
        setSuccess(message);
        setError('');
        window.setTimeout(() => setSuccess(''), 2500);
    }, []);

    const showError = useCallback((message) => {
        setError(message || 'Something went wrong.');
        setSuccess('');
        window.setTimeout(() => setError(''), 5000);
    }, []);

    const fetchTeams = useCallback(async () => {
        const { data, error: fetchError } = await supabase
            .from('teams')
            .select(`
        id,
        team_number,
        team_name,
        status,
        username,
        score,
        joined_at,
        is_joined,
        role,
        is_active
      `)
            .order('team_number', { ascending: true });

        if (fetchError) throw fetchError;
        setTeams(data || []);
    }, []);

    const fetchGameState = useCallback(async () => {
        const { data, error: fetchError } = await supabase
            .from('game_state')
            .select('*')
            .order('updated_at', { ascending: false })
            .limit(1)
            .maybeSingle();

        if (fetchError) throw fetchError;

        setGameState(current => {
            const currentUpdated = new Date(current.updated_at || 0).getTime();
            const fetchUpdated = new Date(data?.updated_at || 0).getTime();
            if (currentUpdated > fetchUpdated) return current;
            return { ...EMPTY_GAME_STATE, ...(data || {}) };
        });
        setAdminMessage(data?.admin_message || '');
    }, []);

    const loadDashboard = useCallback(async () => {
        try {
            setLoading(true);
            setError('');
            await Promise.all([fetchTeams(), fetchGameState()]);
        } catch (err) {
            console.error('ADMIN LOAD ERROR:', err);
            showError(err.message || 'Failed to load admin dashboard.');
        } finally {
            setLoading(false);
        }
    }, [fetchTeams, fetchGameState, showError]);

    useEffect(() => {
        if (isAdmin) loadDashboard();
    }, [isAdmin, loadDashboard]);

    // Realtime is read-only here. All mutations go through protected RPCs.
    useEffect(() => {
        if (!isAdmin) return;

        const teamsChannel = supabase
            .channel('admin-teams-live')
            .on(
                'postgres_changes',
                {
                    event: '*',
                    schema: 'public',
                    table: 'teams',
                },
                (payload) => {
                    setTeams(current => {
                        if (payload.eventType === 'INSERT') {
                            const exists = current.find(t => t.id === payload.new.id);
                            if (exists) return current;
                            return [...current, payload.new];
                        } else if (payload.eventType === 'UPDATE') {
                            return current.map(t => t.id === payload.new.id ? { ...t, ...payload.new } : t);
                        } else if (payload.eventType === 'DELETE') {
                            return current.filter(t => t.id !== payload.old.id);
                        }
                        return current;
                    });
                }
            )
            .subscribe();

        const gameStateChannel = supabase
            .channel('admin-game-state-live')
            .on(
                'postgres_changes',
                {
                    event: '*',
                    schema: 'public',
                    table: 'game_state',
                },
                (payload) => {
                    if (payload.new) {
                        setGameState((current) => {
                            const currentUpdated = new Date(current.updated_at || 0).getTime();
                            const newUpdated = new Date(payload.new.updated_at || 0).getTime();
                            if (currentUpdated > newUpdated) return current;
                            return { ...current, ...payload.new };
                        });
                    }
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(teamsChannel);
            supabase.removeChannel(gameStateChannel);
        };
    }, [isAdmin, fetchTeams]);

    const callAdminRpc = useCallback(async (functionName, params = {}) => {
        setActionLoading(true);
        setError('');
        try {
            const { data, error: rpcError } = await supabase.rpc(functionName, params);
            if (rpcError) throw rpcError;
            if (data) setGameState((current) => ({ ...current, ...data }));
            await fetchTeams();
            return data;
        } catch (err) {
            console.error(`${functionName} ERROR:`, err);
            showError(err.message || `Failed to run ${functionName}.`);
            throw err;
        } finally {
            setActionLoading(false);
        }
    }, [fetchTeams, showError]);

    const startGame = async () => {
        try {
            await callAdminRpc('admin_update_game_state', {
                p_is_live: true,
                p_timer_running: false,
                p_timer_remaining: 1800,
                p_current_round: gameState.current_round || 1,
                p_phase: 'MISSION',
                p_game_status: 'RUNNING',
                p_round_table_open: false,
                p_voting_locked: true,
                p_votes_revealed: false,
                p_game_started_at: gameState.game_started_at || new Date().toISOString(),
            });
            await callAdminRpc('admin_reset_timer');
            showSuccess('GAME STARTED');
        } catch { }
    };

    const endGame = async () => {
        if (!window.confirm('Are you sure you want to end the game?')) return;
        try {
            await callAdminRpc('admin_update_game_state', {
                p_is_live: false,
                p_timer_running: false,
                p_game_status: 'ENDED',
                p_phase: 'ENDED',
                p_game_ended_at: new Date().toISOString(),
            });
            showSuccess('GAME ENDED');
        } catch { }
    };

    const imposterMissionCompleted = async () => {
        if (actionLoading) return;

        const confirmed = window.confirm(
            'The Imposter has completed the mission.\n\n' +
            'Every Innocent team will lose 1 point.\n\n' +
            'Continue?'
        );

        if (!confirmed) return;

        try {
            setActionLoading(true);
            setError('');

            const { data, error: rpcError } = await supabase.rpc(
                'admin_imposter_mission_completed'
            );

            if (rpcError) throw rpcError;

            console.log('IMPOSTER MISSION RESULT:', data);

            await fetchTeams();

            showSuccess(
                'IMPOSTER MISSION COMPLETE — INNOCENT TEAMS -1'
            );

        } catch (err) {
            console.error(
                'IMPOSTER MISSION SCORING ERROR:',
                err
            );

            showError(
                err.message ||
                'Failed to update mission score.'
            );

        } finally {
            setActionLoading(false);
        }
    };

    const startTimer = async () => {
        try {
            await callAdminRpc('admin_start_timer');
            showSuccess('TIMER STARTED');
        } catch { }
    };

    const stopTimer = async () => {
        try {
            await callAdminRpc('admin_stop_timer');
            showSuccess('TIMER STOPPED');
        } catch { }
    };

    const resetTimer = async () => {
        try {
            await callAdminRpc('admin_reset_timer');
            showSuccess('TIMER RESET');
        } catch { }
    };

    const toggleRoundTable = async () => {
        try {
            if (gameState.round_table_open) {
                await callAdminRpc('admin_update_game_state', {
                    p_round_table_open: false,
                    p_phase: 'MISSION',
                    p_voting_locked: true,
                });
                showSuccess('ROUND TABLE CLOSED');
            } else {
                await callAdminRpc('admin_update_game_state', {
                    p_round_table_open: true,
                    p_phase: 'ROUND_TABLE',
                    p_voting_locked: true,
                });
                showSuccess('ROUND TABLE OPENED');
            }
        } catch { }
    };

    const toggleVoting = async () => {
        try {
            const unlocked = gameState.voting_locked;
            await callAdminRpc('admin_update_game_state', {
                p_voting_locked: !unlocked,
                p_phase: unlocked ? 'VOTING' : 'ROUND_TABLE',
            });
            showSuccess(unlocked ? 'VOTING UNLOCKED' : 'VOTING LOCKED');
        } catch { }
    };

    const revealVotes = async () => {
        try {
            await callAdminRpc('admin_update_game_state', {
                p_votes_revealed: true,
                p_phase: 'REVEAL',
            });
            showSuccess('VOTES REVEALED');
        } catch { }
    };

    const saveAdminMessage = async () => {
        try {
            await callAdminRpc('admin_update_game_state', {
                p_admin_message: adminMessage,
            });
            showSuccess('MESSAGE UPDATED');
        } catch { }
    };

    const [liveSeconds, setLiveSeconds] = useState(0);
    useEffect(() => {
        const updateTimer = () => {
            const base = Math.max(
                0,
                Number(gameState.timer_remaining) || 0
            );

            if (!gameState.timer_running || !gameState.timer_started_at) {
                setLiveSeconds(base);
                return;
            }

            const startedAt = new Date(
                gameState.timer_started_at
            ).getTime();

            const elapsed = Math.floor(
                (Date.now() - startedAt) / 1000
            );

            const remaining = Math.max(
                0,
                base - elapsed
            );

            setLiveSeconds(remaining);
        };

        updateTimer();

        if (!gameState.timer_running) {
            return;
        }

        const interval = window.setInterval(updateTimer, 1000);

        return () => {
            window.clearInterval(interval);
        };
    }, [
        gameState.timer_running,
        gameState.timer_started_at,
        gameState.timer_remaining,
    ]);

    const minutes = Math.floor(liveSeconds / 60).toString().padStart(2, '0');
    const seconds = (liveSeconds % 60).toString().padStart(2, '0');

    const timerFinishedRef = useRef(false);

    useEffect(() => {
        // Timer is still running
        if (!gameState.timer_running) {
            timerFinishedRef.current = false;
            return;
        }

        // Timer has not reached zero yet
        if (liveSeconds > 0) {
            return;
        }

        // Prevent duplicate RPC calls
        if (timerFinishedRef.current) {
            return;
        }

        timerFinishedRef.current = true;

        const openRoundTableAutomatically = async () => {
            try {
                await callAdminRpc('admin_update_game_state', {
                    p_timer_running: false,
                    p_timer_remaining: 0,
                    p_round_table_open: true,
                    p_phase: 'ROUND_TABLE',
                    p_voting_locked: true,
                });

                showSuccess('TIME UP — ROUND TABLE OPENED');
            } catch (err) {
                timerFinishedRef.current = false;
                console.error('AUTO ROUND TABLE ERROR:', err);
            }
        };

        openRoundTableAutomatically();
    }, [
        liveSeconds,
        gameState.timer_running,
        callAdminRpc,
        showSuccess,
    ]);

    const joinedTeams = teams.filter((team) => team.is_joined === true).length;
    const imposterCount = teams.filter(
        (team) => String(team.role || '').toUpperCase() === 'IMPOSTER'
    ).length;
    const innocentCount = teams.filter(
        (team) => String(team.role || '').toUpperCase() !== 'IMPOSTER' && team.role
    ).length;
    const sortedLeaderboard = [...teams].sort((a, b) => {
        const scoreDiff = Number(b.score || 0) - Number(a.score || 0);
        if (scoreDiff !== 0) return scoreDiff;
        return Number(a.team_number || 0) - Number(b.team_number || 0);
    });

    const refreshDashboard = async () => {
        try {
            setRefreshing(true);
            await Promise.all([fetchTeams(), fetchGameState()]);
            showSuccess('DATA SYNCED');
        } catch (err) {
            showError(err.message || 'Refresh failed.');
        } finally {
            setRefreshing(false);
        }
    };
    if (checkingAdmin) {
        return (
            <div className="min-h-screen bg-[#030107] text-white flex items-center justify-center">
                <div className="text-purple-300 tracking-widest uppercase">
                    Checking Admin Access...
                </div>
            </div>
        );
    }
    if (!isAdmin) {
        return null;
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-[#030107] text-white flex items-center justify-center">
                <div className="flex items-center gap-3 text-purple-300">
                    <RefreshCw size={24} className="animate-spin" />
                    <span className="tracking-widest uppercase">Loading Admin Control...</span>
                </div>
            </div>
        );
    }

    return (
        <div className="h-screen bg-[#030107] text-white font-sans overflow-y-auto relative">
            <div
                className="fixed inset-0 pointer-events-none opacity-30"
                style={{
                    backgroundImage: `linear-gradient(rgba(139,92,246,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(139,92,246,0.08) 1px, transparent 1px)`,
                    backgroundSize: '40px 40px',
                }}
            />
            <div className="fixed top-0 left-0 right-0 h-[3px] bg-purple-600 z-50 shadow-[0_0_20px_rgba(139,92,246,0.8)]" />

            <div className="relative z-10 max-w-[1800px] mx-auto px-6 py-8">
                <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-10">
                    <div>
                        <div className="flex items-center gap-3 text-purple-400 tracking-[0.35em] text-sm font-bold mb-3">
                            <Shield size={22} /> PARADOX / INFINITY
                        </div>
                        <h1 className="text-5xl md:text-6xl font-black tracking-tight">ADMIN CONTROL</h1>
                        <p className="text-white/45 text-lg mt-2">Traitors vs Innocents — Game Master Console</p>
                    </div>
                    <div className="flex flex-wrap gap-3">
                        <button
                            onClick={refreshDashboard}
                            disabled={refreshing || actionLoading}
                            className="flex items-center justify-center gap-3 px-6 py-4 border border-purple-500/40 bg-purple-950/20 hover:bg-purple-900/30 transition-all uppercase tracking-widest font-bold disabled:opacity-50"
                        >
                            <RefreshCw size={20} className={refreshing ? 'animate-spin' : ''} /> Refresh
                        </button>
                        <button
                            onClick={handleAdminLogout}
                            className="px-6 py-4 border border-red-500/30 bg-red-950/10 hover:bg-red-950/30 text-red-300 uppercase tracking-widest font-bold"
                        >
                            Exit Admin
                        </button>
                    </div>
                </div>

                {error && (
                    <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-6 border border-red-500/50 bg-red-950/30 p-4 flex items-center gap-3 text-red-300">
                        <AlertTriangle size={20} /> {error}
                    </motion.div>
                )}
                {success && (
                    <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-6 border border-green-500/40 bg-green-950/20 p-4 flex items-center gap-3 text-green-300">
                        <CheckCircle2 size={20} /> {success}
                    </motion.div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 mb-7">
                    <StatCard label="TOTAL TEAMS" value={TOTAL_TEAMS} icon={<Users />} color="purple" />
                    <StatCard label="TEAMS JOINED" value={joinedTeams} icon={<Activity />} color="green" />
                    <StatCard label="IMPOSTER" value={imposterCount} icon={<Shield />} color="red" />
                    <StatCard label="INNOCENTS" value={innocentCount} icon={<Trophy />} color="purple" />
                </div>

                <section className="border border-purple-500/30 bg-black/30 p-6 mb-7">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                        <div>
                            <div className="text-purple-400 text-sm tracking-[0.3em] font-bold">GAME CONTROL</div>
                            <h2 className="text-2xl font-black tracking-wider mt-1">MASTER CONTROLS</h2>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className={`w-3 h-3 rounded-full ${gameState.is_live ? 'bg-green-500 shadow-[0_0_12px_rgba(34,197,94,0.9)]' : 'bg-red-500'}`} />
                            <span className="uppercase tracking-wider text-white/80">{gameState.is_live ? 'ONLINE' : 'OFFLINE'}</span>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-6 gap-4">
                        <ControlButton
                            icon={<Shield />}
                            label="IMPOSTER COMPLETED"
                            onClick={imposterMissionCompleted}
                            disabled={
                                actionLoading ||
                                !gameState.is_live
                            }
                            color="red"
                        />
                        <ControlButton icon={<Play />} label="START GAME" onClick={startGame} disabled={actionLoading || gameState.is_live} color="green" />
                        <ControlButton 
                            icon={gameState.round_table_open ? <Unlock /> : <Lock />} 
                            label={gameState.round_table_open ? 'CLOSE ROUND TABLE' : 'OPEN ROUND TABLE'} 
                            onClick={toggleRoundTable} 
                            disabled={actionLoading || !gameState.is_live || (!gameState.round_table_open && (liveSeconds > 0 || gameState.timer_running))} 
                            color="purple" 
                        />
                        <ControlButton icon={gameState.voting_locked ? <Unlock /> : <Lock />} label={gameState.voting_locked ? 'UNLOCK VOTING' : 'LOCK VOTING'} onClick={toggleVoting} disabled={actionLoading || !gameState.round_table_open} color="purple" />
                        <ControlButton icon={<Vote />} label="REVEAL VOTES" onClick={revealVotes} disabled={actionLoading || gameState.votes_revealed || gameState.voting_locked} color="yellow" />
                        <ControlButton icon={<Square />} label="END GAME" onClick={endGame} disabled={actionLoading || !gameState.is_live} color="red" />
                    </div>
                </section>

                <section className="border border-purple-500/30 bg-black/30 p-6 mb-7">
                    <div className="text-purple-400 text-sm tracking-[0.3em] font-bold">MASTER TIMER</div>
                    <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-7 mt-5">
                        <div className="flex items-center gap-5">
                            <Clock3 size={48} className="text-purple-400" />
                            <div>
                                <div className="text-6xl md:text-7xl font-black tracking-wider tabular-nums">{minutes}:{seconds}</div>
                                <div className="text-white/40 uppercase tracking-[0.3em] text-xs mt-2">{gameState.timer_running ? 'TIMER RUNNING' : 'TIMER STOPPED'}</div>
                            </div>
                        </div>
                        <div className="flex flex-wrap items-center gap-3">
                            <button onClick={startTimer} disabled={actionLoading || gameState.timer_running || !gameState.is_live} className="flex items-center gap-2 px-6 py-4 bg-green-600 hover:bg-green-500 font-bold uppercase tracking-wider transition-all disabled:opacity-40"><Play size={20} /> START</button>
                            <button onClick={stopTimer} disabled={actionLoading || !gameState.timer_running} className="flex items-center gap-2 px-6 py-4 bg-red-600 hover:bg-red-500 font-bold uppercase tracking-wider transition-all disabled:opacity-40"><Square size={20} /> STOP</button>
                            <button onClick={resetTimer} disabled={actionLoading} className="flex items-center gap-2 px-6 py-4 border border-white/20 hover:border-purple-400 bg-black/30 font-bold uppercase tracking-wider transition-all disabled:opacity-40"><RotateCcw size={20} /> RESET</button>
                        </div>
                    </div>
                </section>

                <section className="border border-purple-500/30 bg-black/30 p-6 mb-7">
                    <div className="text-purple-400 text-sm tracking-[0.3em] font-bold">LIVE STATE</div>
                    <h2 className="text-2xl font-black tracking-wider mt-1 mb-6">GAME STATUS</h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <StateBox label="ROUND" value={gameState.current_round || 1} />
                        <StateBox label="PHASE" value={gameState.phase || 'LOBBY'} />
                        <StateBox label="STATUS" value={gameState.game_status || 'WAITING'} />
                        <StateBox label="MISSION" value={gameState.current_mission || 'NOT ASSIGNED'} />
                    </div>
                    <div className="mt-5 flex flex-col md:flex-row gap-3">
                        <input value={adminMessage} onChange={(e) => setAdminMessage(e.target.value)} placeholder="Broadcast message to players..." className="flex-1 bg-black/50 border border-purple-500/20 px-4 py-4 outline-none focus:border-purple-500/60" />
                        <button onClick={saveAdminMessage} disabled={actionLoading} className="px-7 py-4 bg-purple-700 hover:bg-purple-600 font-bold uppercase tracking-wider disabled:opacity-40">UPDATE MESSAGE</button>
                    </div>
                </section>

                <section className="border border-purple-500/30 bg-black/30 p-6 mb-7">

                    {/* HEADER */}
                    <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-7">
                        <div>
                            <div className="text-purple-400 text-sm tracking-[0.3em] font-bold">
                                PARTICIPANTS
                            </div>

                            <h2 className="text-2xl font-black tracking-wider mt-1">
                                TEAM LOBBY
                            </h2>

                            <p className="text-white/35 text-sm mt-2 uppercase tracking-widest">
                                Teams appear here as they join the game
                            </p>
                        </div>

                        <div className="flex items-center gap-3">
                            <div className="w-3 h-3 rounded-full bg-green-500 shadow-[0_0_12px_rgba(34,197,94,0.9)]" />

                            <span className="text-white font-black text-lg">
                                {joinedTeams}
                            </span>

                            <span className="text-white/30">
                                / {TOTAL_TEAMS}
                            </span>

                            <span className="text-white/40 uppercase tracking-widest text-xs">
                                Joined
                            </span>
                        </div>
                    </div>

                    {/* JOINED TEAMS */}
                    {joinedTeams === 0 ? (
                        <div className="min-h-[260px] flex flex-col items-center justify-center border border-dashed border-white/10 bg-black/20">

                            <Users
                                size={48}
                                className="text-white/15 mb-4"
                            />

                            <div className="text-white/40 uppercase tracking-[0.25em] font-bold">
                                Waiting for teams...
                            </div>

                            <div className="text-white/20 text-xs uppercase tracking-widest mt-2">
                                Teams will appear automatically when they join
                            </div>

                        </div>
                    ) : (

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">

                            {teams
                                .filter((team) => team.is_joined === true)
                                .sort(
                                    (a, b) =>
                                        Number(a.team_number) -
                                        Number(b.team_number)
                                )
                                .map((team) => (

                                    <JoinedTeamCard
                                        key={team.id}
                                        team={team}
                                    />

                                ))}

                        </div>
                    )}

                </section>

                <section className="border border-purple-500/30 bg-black/30 p-6 mb-10">
                    <div className="text-purple-400 text-sm tracking-[0.3em] font-bold">PERFORMANCE</div>
                    
                    <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-6 mt-1">
                        <h2 className="text-2xl font-black tracking-wider">LEADERBOARD</h2>
                        <div className="flex items-center gap-2 bg-green-950/20 border border-green-500/30 px-3 py-1.5">
                            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.8)]"></span>
                            <span className="text-xs font-bold text-green-400 tracking-[0.2em] uppercase">LIVE • UPDATING</span>
                        </div>
                    </div>

                    <div className="space-y-3">
                        {sortedLeaderboard.map((team, index) => {
                            const isFirst = index === 0;
                            const isSecond = index === 1;
                            const isThird = index === 2;
                            
                            let borderClass = 'border-white/5';
                            let textClass = 'text-purple-400';
                            let scoreClass = 'text-purple-300 text-2xl';
                            let bgClass = 'bg-black/30';
                            
                            if (isFirst) {
                                borderClass = 'border-yellow-500/50 shadow-[0_0_15px_rgba(234,179,8,0.1)]';
                                textClass = 'text-yellow-400';
                                scoreClass = 'text-yellow-400 text-4xl';
                                bgClass = 'bg-yellow-950/10';
                            } else if (isSecond) {
                                borderClass = 'border-purple-400/40';
                                textClass = 'text-purple-300';
                                scoreClass = 'text-purple-300 text-3xl';
                                bgClass = 'bg-purple-950/20';
                            } else if (isThird) {
                                borderClass = 'border-purple-500/30';
                                textClass = 'text-purple-400';
                                scoreClass = 'text-purple-400 text-3xl';
                                bgClass = 'bg-purple-950/10';
                            }

                            return (
                                <div key={team.id} className={`grid grid-cols-[70px_1fr_120px] items-center border px-5 py-4 transition-all ${borderClass} ${bgClass}`}>
                                    <div className={`font-black text-2xl flex items-center gap-2 ${textClass}`}>
                                        #{index + 1}
                                        {isFirst && <Trophy size={20} className="text-yellow-500" />}
                                    </div>
                                    <div>
                                        <div className="text-[10px] text-white/40 mb-1 uppercase tracking-[0.2em] font-bold">TEAM {String(team.team_number).padStart(2, '0')}</div>
                                        <div className={`font-black uppercase tracking-wider ${isFirst ? 'text-xl' : 'text-lg text-white/90'}`}>{team.team_name || `TEAM ${String(team.team_number).padStart(2, '0')}`}</div>
                                    </div>
                                    <div className="text-right">
                                        <div className={`font-black ${scoreClass}`}>{team.score || 0}</div>
                                        <div className="text-[10px] text-white/30 uppercase tracking-[0.2em] font-bold mt-1">POINTS</div>
                                    </div>
                                </div>
                            );
                        })}
                        {sortedLeaderboard.length === 0 && (
                            <div className="py-16 border border-dashed border-white/10 flex flex-col items-center justify-center bg-black/20">
                                <Trophy size={48} className="text-white/10 mb-5" />
                                <div className="text-white/40 font-bold tracking-[0.3em] uppercase">NO TEAM DATA AVAILABLE</div>
                            </div>
                        )}
                    </div>
                </section>
            </div>
        </div>
    );
}

function StatCard({ label, value, icon, color }) {
    const colors = { purple: 'border-purple-500/30 text-purple-400', green: 'border-green-500/30 text-green-400', red: 'border-red-500/30 text-red-400' };
    return <div className={`border bg-black/30 p-6 ${colors[color]}`}><div className="flex items-start justify-between"><span className="text-white/40 text-sm font-bold tracking-widest">{label}</span>{icon}</div><div className="text-5xl font-black mt-5">{value}</div></div>;
}

function ControlButton({ icon, label, onClick, disabled, color }) {
    const colors = { green: 'hover:border-green-500/60 hover:bg-green-950/20', purple: 'hover:border-purple-500/60 hover:bg-purple-950/20', yellow: 'hover:border-yellow-500/60 hover:bg-yellow-950/20', red: 'hover:border-red-500/60 hover:bg-red-950/20' };
    return <button onClick={onClick} disabled={disabled} className={`border border-purple-500/20 bg-black/30 min-h-[90px] flex items-center justify-center gap-3 font-bold text-purple-200 uppercase tracking-wider transition-all disabled:opacity-30 disabled:cursor-not-allowed ${colors[color]}`}>{icon}{label}</button>;
}

function StateBox({ label, value }) {
    return <div className="border border-white/10 bg-black/30 p-5"><div className="text-xs tracking-widest text-white/35 uppercase">{label}</div><div className="mt-2 font-black text-lg text-purple-300 uppercase truncate">{value}</div></div>;
}

function JoinedTeamCard({ team }) {
    const role = String(team?.role || '').toUpperCase();

    const isImposter = role === 'IMPOSTER';

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.25 }}
            className="group relative overflow-hidden border border-purple-500/30 bg-[#08050F] p-5 hover:border-purple-400/70 hover:bg-purple-950/20 transition-all"
        >

            {/* TOP GLOW */}
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-purple-500 opacity-60 group-hover:opacity-100 transition-opacity" />

            {/* HEADER */}
            <div className="flex items-center justify-between mb-5">

                <div className="flex items-center gap-3">

                    <div className="w-10 h-10 flex items-center justify-center border border-purple-500/30 bg-purple-950/30 text-purple-300 font-black">
                        {String(team.team_number).padStart(2, '0')}
                    </div>

                    <div>
                        <div className="text-xs text-white/30 uppercase tracking-widest">
                            TEAM
                        </div>

                        <div className="font-black text-white">
                            {team.team_name ||
                                `TEAM ${String(team.team_number).padStart(2, '0')}`}
                        </div>
                    </div>

                </div>

                {/* ONLINE */}
                <div className="flex items-center gap-2">

                    <span className="w-2.5 h-2.5 rounded-full bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.9)]" />

                    <span className="text-[10px] text-green-400 font-bold uppercase tracking-widest">
                        Connected
                    </span>

                </div>

            </div>

            {/* USERNAME */}
            <div className="border border-white/5 bg-black/30 p-3 mb-4">

                <div className="text-[9px] text-white/25 uppercase tracking-[0.2em] mb-1">
                    PLAYER
                </div>

                <div className="text-sm text-white/80 font-bold truncate">
                    {team.username || 'Unknown'}
                </div>

            </div>

            {/* BOTTOM INFO */}
            <div className="flex items-center justify-between">

                <div>
                    <div className="text-[9px] text-white/25 uppercase tracking-widest">
                        SCORE
                    </div>

                    <div className="text-xl font-black text-purple-300">
                        {team.score || 0}
                    </div>
                </div>

                <div
                    className={`flex items-center gap-2 px-3 py-2 border text-[10px] font-black tracking-widest ${isImposter
                        ? 'border-red-500/40 bg-red-950/30 text-red-400'
                        : 'border-green-500/30 bg-green-950/20 text-green-400'
                        }`}
                >
                    {isImposter ? (
                        <>
                            <Shield size={13} />
                            IMPOSTER
                        </>
                    ) : (
                        <>
                            <CheckCircle2 size={13} />
                            INNOCENT
                        </>
                    )}
                </div>
            </div>

        </motion.div>
    );
}

function TeamRow({ teamNumber, team }) {
    const [scoreLoading, setScoreLoading] = useState(false);

    const joined = team?.is_joined === true;
    const role = String(team?.role || '—').toUpperCase();
    const isImposter = role === 'IMPOSTER';

    const updateScore = async (delta) => {
        if (!team?.id || scoreLoading) return;

        try {
            setScoreLoading(true);

            const { data, error } = await supabase.rpc(
                'admin_update_team_score',
                {
                    p_team_id: team.id,
                    p_delta: delta,
                }
            );

            if (error) throw error;

            console.log('SCORE UPDATED:', data);
        } catch (error) {
            console.error('SCORE UPDATE ERROR:', error);
            alert(error.message || 'Failed to update score');
        } finally {
            setScoreLoading(false);
        }
    };

    return (
        <tr className="border-b border-white/5 hover:bg-purple-950/10 transition-colors">

            {/* TEAM NUMBER */}
            <td className="py-4 px-3 font-black text-purple-300">
                {String(teamNumber).padStart(2, '0')}
            </td>

            {/* TEAM */}
            <td className="py-4 px-3">
                <div className="font-bold">
                    {team?.team_name ||
                        `TEAM ${String(teamNumber).padStart(2, '0')}`}
                </div>
            </td>

            {/* USERNAME */}
            <td className="py-4 px-3 text-white/60">
                {team?.username || '—'}
            </td>

            {/* JOINED */}
            <td className="py-4 px-3">
                <div className="flex items-center gap-2">
                    <span
                        className={`w-2.5 h-2.5 rounded-full ${joined
                            ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.8)]'
                            : 'bg-white/20'
                            }`}
                    />

                    <span
                        className={
                            joined
                                ? 'text-green-400'
                                : 'text-white/30'
                        }
                    >
                        {joined ? 'JOINED' : 'WAITING'}
                    </span>
                </div>
            </td>

            {/* STATUS */}
            <td className="py-4 px-3 text-white/60">
                {team?.status || '—'}
            </td>

            {/* ROLE */}
            <td className="py-4 px-3">
                {role !== '—' ? (
                    <span
                        className={`inline-flex items-center gap-2 px-3 py-1.5 border text-xs font-black tracking-widest ${isImposter
                            ? 'border-red-500/40 bg-red-950/30 text-red-400'
                            : 'border-green-500/30 bg-green-950/20 text-green-400'
                            }`}
                    >
                        {isImposter ? (
                            <Shield size={14} />
                        ) : (
                            <CheckCircle2 size={14} />
                        )}

                        {role}
                    </span>
                ) : (
                    <span className="text-white/20">—</span>
                )}
            </td>

            {/* SCORE CONTROL */}
            <td className="py-4 px-3">
                <div className="flex items-center justify-end gap-2">

                    <button
                        onClick={() => updateScore(-10)}
                        disabled={!team || scoreLoading}
                        className="px-2.5 py-1.5 border border-red-500/30 text-red-400 hover:bg-red-950/30 disabled:opacity-30 font-bold"
                    >
                        -10
                    </button>

                    <button
                        onClick={() => updateScore(-5)}
                        disabled={!team || scoreLoading}
                        className="px-2.5 py-1.5 border border-red-500/20 text-red-300 hover:bg-red-950/20 disabled:opacity-30 font-bold"
                    >
                        -5
                    </button>

                    <div className="min-w-[70px] text-center">
                        <div className="text-xl font-black text-purple-300">
                            {team?.score || 0}
                        </div>
                        <div className="text-[9px] text-white/30 uppercase tracking-widest">
                            points
                        </div>
                    </div>

                    <button
                        onClick={() => updateScore(5)}
                        disabled={!team || scoreLoading}
                        className="px-2.5 py-1.5 border border-green-500/30 text-green-400 hover:bg-green-950/30 disabled:opacity-30 font-bold"
                    >
                        +5
                    </button>

                    <button
                        onClick={() => updateScore(10)}
                        disabled={!team || scoreLoading}
                        className="px-2.5 py-1.5 border border-green-500/30 text-green-400 hover:bg-green-950/30 disabled:opacity-30 font-bold"
                    >
                        +10
                    </button>

                </div>
            </td>

        </tr>
    );
}
