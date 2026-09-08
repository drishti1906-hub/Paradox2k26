import { useCallback, useEffect, useMemo, useState } from 'react';
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

        const next = { ...EMPTY_GAME_STATE, ...(data || {}) };
        setGameState(next);
        setAdminMessage(next.admin_message || '');
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
                () => {
                    fetchTeams().catch(console.error);
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
                        setGameState((current) => ({
                            ...current,
                            ...payload.new,
                        }));
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
                p_current_round: gameState.current_round || 1,
                p_phase: 'MISSION',
                p_game_status: 'RUNNING',
                p_round_table_open: false,
                p_voting_locked: true,
                p_votes_revealed: false,
                p_game_started_at: gameState.game_started_at || new Date().toISOString(),
            });
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

    const displayedSeconds = useMemo(() => {
        if (!gameState.timer_running || !gameState.timer_started_at) {
            return Math.max(0, Number(gameState.timer_remaining) || 0);
        }

        const startedAt = new Date(gameState.timer_started_at).getTime();
        const elapsed = Math.floor((Date.now() - startedAt) / 1000);
        return Math.max(0, (Number(gameState.timer_remaining) || 0) - elapsed);
    }, [gameState.timer_running, gameState.timer_started_at, gameState.timer_remaining]);

    const [liveSeconds, setLiveSeconds] = useState(displayedSeconds);

    useEffect(() => {
        setLiveSeconds(displayedSeconds);
        if (!gameState.timer_running) return undefined;

        const interval = window.setInterval(() => {
            const startedAt = new Date(gameState.timer_started_at).getTime();
            const elapsed = Math.floor((Date.now() - startedAt) / 1000);
            const remaining = Math.max(0, (Number(gameState.timer_remaining) || 0) - elapsed);
            setLiveSeconds(remaining);
        }, 1000);

        return () => window.clearInterval(interval);
    }, [displayedSeconds, gameState.timer_running]);

    const minutes = Math.floor(liveSeconds / 60).toString().padStart(2, '0');
    const seconds = (liveSeconds % 60).toString().padStart(2, '0');

    const joinedTeams = teams.filter((team) => team.is_joined === true).length;
    const imposterCount = teams.filter(
        (team) => String(team.role || '').toUpperCase() === 'IMPOSTER'
    ).length;
    const innocentCount = teams.filter(
        (team) => String(team.role || '').toUpperCase() !== 'IMPOSTER' && team.role
    ).length;
    const sortedLeaderboard = [...teams].sort(
        (a, b) => Number(b.score || 0) - Number(a.score || 0)
    );

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
        <div className="min-h-screen bg-[#030107] text-white font-sans overflow-y-auto">
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

                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-4">
                        <ControlButton icon={<Play />} label="START GAME" onClick={startGame} disabled={actionLoading || gameState.is_live} color="green" />
                        <ControlButton icon={gameState.round_table_open ? <Unlock /> : <Lock />} label={gameState.round_table_open ? 'CLOSE ROUND TABLE' : 'OPEN ROUND TABLE'} onClick={toggleRoundTable} disabled={actionLoading || !gameState.is_live} color="purple" />
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
                    <div className="flex items-end justify-between mb-6">
                        <div>
                            <div className="text-purple-400 text-sm tracking-[0.3em] font-bold">PARTICIPANTS</div>
                            <h2 className="text-2xl font-black tracking-wider mt-1">TEAM STATUS</h2>
                        </div>
                        <div className="text-white/40">{joinedTeams} / {TOTAL_TEAMS} JOINED</div>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full min-w-[1250px]">
                            <thead><tr className="border-b border-white/10 text-white/40 text-xs uppercase tracking-widest"><th className="text-left py-4 px-3">#</th><th className="text-left py-4 px-3">Team</th><th className="text-left py-4 px-3">Username</th><th className="text-left py-4 px-3">Joined</th><th className="text-left py-4 px-3">Status</th><th className="text-left py-4 px-3">Role</th><th className="text-right py-4 px-3">Score Control</th></tr></thead>
                            <tbody>{Array.from({ length: TOTAL_TEAMS }, (_, index) => { const teamNumber = index + 1; const team = teams.find((t) => Number(t.team_number) === teamNumber); return <TeamRow key={teamNumber} teamNumber={teamNumber} team={team} />; })}</tbody>
                        </table>
                    </div>
                </section>

                <section className="border border-purple-500/30 bg-black/30 p-6 mb-10">
                    <div className="text-purple-400 text-sm tracking-[0.3em] font-bold">PERFORMANCE</div>
                    <h2 className="text-2xl font-black tracking-wider mt-1 mb-6">LEADERBOARD</h2>
                    <div className="space-y-2">
                        {sortedLeaderboard.map((team, index) => (
                            <div key={team.id} className="grid grid-cols-[60px_1fr_120px] items-center border border-white/5 bg-black/30 px-5 py-4">
                                <div className="text-purple-400 font-black text-xl">#{index + 1}</div>
                                <div><div className="font-bold">{team.team_name || `TEAM ${String(team.team_number).padStart(2, '0')}`}</div><div className="text-xs text-white/35 mt-1">TEAM {String(team.team_number).padStart(2, '0')}</div></div>
                                <div className="text-right"><div className="text-2xl font-black text-purple-300">{team.score || 0}</div><div className="text-xs text-white/30 uppercase">points</div></div>
                            </div>
                        ))}
                        {sortedLeaderboard.length === 0 && <div className="py-10 text-center text-white/30">No teams available yet.</div>}
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
